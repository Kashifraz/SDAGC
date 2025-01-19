/***************************************************************
* ECG Wireless Transmission System - Receiver Code
*
* Author: Dongwoo Lee
*
* This receiver code is designed to process and display ECG data 
* received wirelessly via ZigBee technology. The ECG data is visualized
* on a TFT LCD display, providing real-time monitoring capabilities.
*
* The structure and some functionalities of this code were informed by 
* publicly available resources and examples within the Arduino community.
* Specific algorithms or methods used in this code are inspired by 
* documentation and forum discussions related to ECG data handling.
*
* Generated with the assistance of OpenAI's ChatGPT.
***************************************************************/
#include <SPFD5408_Adafruit_GFX.h>
#include <SPFD5408_Adafruit_TFTLCD.h>
#include <SPFD5408_TouchScreen.h>

#define YP A1
#define XM A2
#define YM 7
#define XP 6
#define TS_MINX 125
#define TS_MINY 85
#define TS_MAXX 965
#define TS_MAXY 905
#define LCD_CS A3
#define LCD_CD A2
#define LCD_WR A1
#define LCD_RD A0
#define LCD_RESET A4

#define BLACK   0x0000
#define RED     0xF800
#define WHITE   0xFFFF

#define SETUP_BUTTON_X (tft.width() - SETUP_BUTTON_W) // 화면 너비에서 버튼 너비를 뺀 값
#define SETUP_BUTTON_Y (tft.height() - SETUP_BUTTON_H) // 화면 높이에서 버튼 높이를 뺀 값
#define SETUP_BUTTON_W 100 // 버튼 너비 설정
#define SETUP_BUTTON_H 40 // 버튼 높이 설정

#include <SD.h>
#define SD_CS_PIN 10

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);
Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);

File dataFile;
File logFile;
const char LOG_FILE_NAME[] = "file_log.txt";

void setup() {
  tft.reset();
  tft.begin(0x9341); // TFT LCD를 시작
  tft.setRotation(1); // 화면 회전을 설정

  Serial.begin(9600); // Zigbee 모듈 통신 속도 설정

  // SD 카드를 초기화합니다.
  if (!SD.begin(SD_CS_PIN)) {
    displayMessage("SD Card failed, or not present", 0);
    while (true); // SD 카드가 없거나 실패하면 여기서 계속 멈춤
  }

  tft.setTextColor(WHITE);
  tft.setTextSize(1);
  tft.setCursor(10, 10);
  tft.println(F("Digital Health Care\n 22022247016 Dongwoo Lee"));

  // SD 카드 초기화 성공 메시지
  displayMessage("SD Card initialized.", 20);

  // 새로운 데이터 파일을 생성합니다.
  String fileName = createUniqueFileName();
  handleLogFile(fileName);
  dataFile = SD.open(fileName.c_str(), FILE_WRITE);
  if (dataFile) {
    if (dataFile.size() == 0) {
      dataFile.println("time,ch1,ch2"); // 파일이 비어 있으면 헤더를 씁니다.
    }
    displayMessage("File " + fileName + " created.", 40);
  } else {
    displayMessage("Error opening " + fileName, 40);
  }
  delay(2000);
  tft.fillScreen(BLACK);
  drawButton();
}

void displayMessage(String message, int y) {
  tft.fillScreen(BLACK); // 화면을 검은색으로 초기화
  tft.setTextColor(WHITE); // 텍스트 색상을 흰색으로 설정
  tft.setTextSize(1); // 텍스트 크기를 설정
  tft.setCursor(0, y);
  tft.println(message);
}

void drawButton() {
  // 버튼의 배경
  tft.fillRect(SETUP_BUTTON_X, SETUP_BUTTON_Y, SETUP_BUTTON_W, SETUP_BUTTON_H, WHITE);

  // 버튼의 테두리
  tft.drawRect(SETUP_BUTTON_X, SETUP_BUTTON_Y, SETUP_BUTTON_W, SETUP_BUTTON_H, RED);

  // 버튼 위에 텍스트를 추가
  tft.setTextColor(BLACK);
  tft.setTextSize(2);
  tft.setCursor(SETUP_BUTTON_X + 12, SETUP_BUTTON_Y + SETUP_BUTTON_H / 2 - 8);
  tft.println("STOP");
}

void handleLogFile(String fileName) {
  logFile = SD.open(LOG_FILE_NAME, FILE_WRITE);
  if (!logFile) {
    displayMessage("Could not open log file", 60);
    while (true);
  }
  logFile.println(fileName);
  logFile.flush();
}

String createUniqueFileName() {
  unsigned long timestamp = millis();
  String fileName = "ECG_" + String(timestamp) + ".csv";
  return fileName;
}

void appendToLogFile(String fileName) {
  if (logFile) {
    logFile.println(fileName);
    logFile.flush();
  } else {
    tft.println("Log file write failed.");
  }
}

int n_XPos = 0; // X축 position을 추적하는 변수
const int RPeakThreshold = 1.65; // R-peak threshold

void drawECG(float VOLT0, float VOLT1) {
  if (dataFile) {
    unsigned long timestamp = millis();
    dataFile.print(timestamp);
    dataFile.print(",");
    dataFile.print(VOLT0, 4);
    dataFile.print(",");
    dataFile.println(VOLT1, 4);
    dataFile.flush();
  } else {
    tft.println("error writing to ecg_data.csv");
  }
  // 이전의 X, Y 위치
  static int prevX = 0;
  static int prevY0 = tft.height() * 0.5;
  static int prevY1 = tft.height() * 0.5;

  // 전압을 화면 높이에 mapping 하기 위해 Normalization 수행
  int y0 = (int)(VOLT0 * (tft.height() / 3.3));
  int y1 = (int)(VOLT1 * (tft.height() / 3.3));

  // 채널 2 심전도, R-peak thresholding을 통해 r-peak 격자를 붉은 수직선으로 구현
  if (VOLT1 > RPeakThreshold) {
    tft.drawFastVLine(n_XPos, tft.height()/2-60, 120, RED);
  }

  // 채널 1 데이터 출력
  tft.drawLine(prevX, prevY0, n_XPos, y0, WHITE);

  prevX = n_XPos;
  prevY0 = y0;
  prevY1 = y1;

  n_XPos++;

  // 데이터가 길이를 초과하기 전에 화면 초기화
  if (n_XPos >= tft.width()) {
    n_XPos = 0;
    prevX = 0;
    prevY0 = tft.height() * 0.5;
    prevY1 = tft.height() * 0.5;
    tft.fillScreen(BLACK);
    drawButton();
  }
  // delay(1000); // 1s 동안 대기
}

void closeLogFile() {
  if (logFile) {
    logFile.close(); // Close the log file
  }
}

bool isRunning = false;
bool firstStart = true;

void loop() {
  // 터치 입력을 확인합니다.
  TSPoint p = ts.getPoint();
  
  // 터치 좌표를 LCD 화면 좌표로 변환합니다.
  pinMode(XM, OUTPUT);
  pinMode(YP, OUTPUT);
  if (p.z > 100) { // 터치가 감지된 경우
    int x = tft.width() - map(p.x, TS_MINX, TS_MAXX, 0, tft.width());
    int y = map(p.y, TS_MINY, TS_MAXY, 0, tft.height());

  // 좌우 반전된 버튼 영역에 터치가 감지되었는지 확인
    if (x > SETUP_BUTTON_X && x < 1*(SETUP_BUTTON_X + 2*SETUP_BUTTON_W) && y > SETUP_BUTTON_Y && y < 1*(SETUP_BUTTON_Y + SETUP_BUTTON_H)) {

      isRunning = !isRunning;

      // 상태에 따라 화면에 메시지를 출력합니다.
      tft.fillScreen(BLACK);
      tft.setTextColor(WHITE);
      tft.setTextSize(2);
      tft.setCursor(10, 10);
      if (isRunning) {
        if (firstStart){ // 초기 실행일 떄는 Start 문구 출력
          tft.println("Program Started");
          firstStart = false;
        }
        else { // 재귀 실행일 떄는 Resumed 문구 출력
          tft.println("Program Resumed");
        }
      } else {
        tft.println("Program Stopped");
      }
      drawButton();
    }
  }

  if (isRunning && Serial.available() > 0) {
    String receivedData = Serial.readStringUntil('\n');
    receivedData.trim();

    int commaIndex = receivedData.indexOf(',');
    if (commaIndex != -1) {
      String volt0String = receivedData.substring(0, commaIndex);
      String volt1String = receivedData.substring(commaIndex + 1);

      float VOLT0 = volt0String.toFloat();
      float VOLT1 = volt1String.toFloat();
      drawECG(VOLT0, VOLT1);
    }
  }
}
