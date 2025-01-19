#pragma once

namespace MineSweeper {
    using namespace System;
    using namespace System::ComponentModel;
    using namespace System::Collections;
    using namespace System::Windows::Forms;
    using namespace System::Data;
    using namespace System::Drawing;
    using namespace System::IO;
    using namespace System::Media;
    using namespace System::Resources;
    using namespace System::Reflection;

#include "MineButton.h" 
#include "CustomButton.h"
#include "MineField.h"
#include "LoadedFont.cpp"
#include "GameStatistics.cpp"

 
    public ref class MyForm : public System::Windows::Forms::Form {
    /**
     * default form class, used for calling the base methods, which initialize the form interface and functionality
     */
    public: MyForm(void) {
        InitializeComponent();
        InitializePictures();
        InitializeCustomFieldUI();
        InitializeMenuUI();
        InitializeStatisticsUI();
        InitializeTimer();
        gameStats = gcnew GameStatistics();
        gameStats->LoadFromFile();
        UpdateStatisticLabels(gameStats);
    }

    protected:
        ~MyForm() {
            if (components) {
                delete components;
            }
        }

    protected:
        /**
        * creates all the needed components for the project
        * " ^ " is the .NET equivalent of " & "
        * 
        * brief description of the objects used:
        * 
        * Button: a graphical interface element that provides the user a simple way to trigger an event, like clicking or tapping. It often contains text or an icon indicating what will happen when the user interacts with it.
        * 
        * Label: a simple control that displays a text string which the user can't modify directly. It's often used to identify other user interface elements or provide short instructions or explanations.
        * 
        * TextBox: this control allows the user to input text. It's typically used for gathering user input, such as typing in a search query, entering a password, or writing a message.
        * 
        * PictureBox: a control that displays an image. 
        * 
        * Timer: a component that allows you to perform an action at specified intervals or to track time passed        * 
        */
    private: System::ComponentModel::Container^ components;
           MineField^ mineField;
           TextBox^ numRowsTextBox;
           TextBox^ numColsTextBox;
           TextBox^ numBombsTextBox;
           CustomButton^ generateCustomFieldButton;
           Button^ btnSave;
           Button^ btnLoad;
           Button^ btnHint;
           Button^ btnExit;
           const int leftToolBarSize = 180;
           const int topToolBarSize = 50;
           const int formWidth = 1200;
           const int formHeight = 800;
           Label^ lblSave;
           Label^ lblLoad;
           Label^ lblHint;
           Label^ lblExit;
           Label^ lblCustomField;
           Label^ lblBestTime;           
           Label^ lblGamesPlayed;
           Label^ lblGamesWon;
           Label^ lblWinPercentage;
           Label^ lblLongestWinStreak;
           Label^ lblLongestLoseStreak;
           Label^ lblCurrentStreak;
           Label^ lblStatistics;
           Label^ lblSettings;
           Label^ lblRows;
           Label^ lblCols;
           Label^ lblBombs;
           Label^ lblTimer;
           GameStatistics^ gameStats;
           Timer^ gameTimer;
           Label^ elapsedTimeLabel;
           int elapsedTimeInSeconds = 0;
           LoadedFont^ loadedFont = LoadFont(gcnew FileInfo( "customFont.ttf" ), 40, FontStyle::Regular);
           LoadedFont^ loadedFontBigger = LoadFont(gcnew FileInfo( "customFont.ttf" ), 52, FontStyle::Regular);
           PictureBox^ timePannelPicBox = gcnew PictureBox();
           PictureBox^ logoPicBox = gcnew PictureBox();
           PictureBox^ mainSideBtnPicBox = gcnew PictureBox();
           PictureBox^ sideBtnPicBox = gcnew PictureBox();
           PictureBox^ sideBtnPicBox2 = gcnew PictureBox();
           PictureBox^ sideBtnPicBox3 = gcnew PictureBox();
           PictureBox^ sideBtnPicBox4 = gcnew PictureBox();
           PictureBox^ coveredSlotPicBox = gcnew PictureBox();
           PictureBox^ uncoveredSlotPicBox = gcnew PictureBox();
           PictureBox^ valueInputPannelPicBox = gcnew PictureBox();
           PictureBox^ valueInputPannelPicBox2 = gcnew PictureBox();
           PictureBox^ valueInputPannelPicBox3 = gcnew PictureBox();
           PictureBox^ settingsPannelPicBox = gcnew PictureBox();
           PictureBox^ statisticsPannelPicBox = gcnew PictureBox();
           PictureBox^ bombPicBox = gcnew PictureBox();

           PictureBox^ flagPicBox = gcnew PictureBox();


#pragma region Windows Form Designer generated code
           /**
           * initializes the base form properties
           * this method is created by .NET by default (with interface properties modified by me)
           */
           void InitializeComponent(void) {
               System::ComponentModel::ComponentResourceManager^ resources = (gcnew System::ComponentModel::ComponentResourceManager(MyForm::typeid));
               this->SuspendLayout();
               // 
               // MyForm
               // 
               this->AutoScaleDimensions = System::Drawing::SizeF(6, 13);
               this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
               this->BackColor = System::Drawing::Color::FromArgb(static_cast<System::Int32>(static_cast<System::Byte>(255)), static_cast<System::Int32>(static_cast<System::Byte>(225)),
                   static_cast<System::Int32>(static_cast<System::Byte>(231)));
               this->ClientSize = System::Drawing::Size(1184, 761);
               this->FormBorderStyle = System::Windows::Forms::FormBorderStyle::FixedSingle;
               this->Icon = (cli::safe_cast<System::Drawing::Icon^>(resources->GetObject(L"$this.Icon")));
               this->MaximumSize = System::Drawing::Size(1200, 800);
               this->MinimumSize = System::Drawing::Size(1200, 800);
               this->Name = L"MyForm";
               this->Text = L"PinkSweeper";
               this->Load += gcnew System::EventHandler(this, &MyForm::MyForm_Load);
               this->ResumeLayout(false);

           }
#pragma endregion

    /**
    * generates a 15x15 grid with 20 bombs upon loading the project
    */
    private: System::Void MyForm_Load(Object^ sender, EventArgs^ e) {
        GenerateMatrixOfButtons(15, 15, 20, nullptr, nullptr, nullptr);
    }
           /**
           * generates the labels and buttons for customizing the game grid
           * below are explained all the parameters for one label only, as for the rest of the labels and buttons in the code the specifics are the same
           */
           void MyForm::InitializeCustomFieldUI()
           {

               lblRows = gcnew Label(); //! label "rows: "
               lblRows->Location = Point(300, 697); //! location of the specified object, X and Y coordinates
               lblRows->BackColor = System::Drawing::Color::FromArgb(254, 248, 150, 181); //! background color of the object, in a RGB format
               lblRows->AutoSize = true; 
               lblRows->Font = loadedFont->Font; //! setting the font of the object to the custom font
               lblRows->ForeColor = Color::White; //! text color of the object, with the default White color from .NET
               lblRows->Text = "rows"; //! text in the object 
               Controls->Add(lblRows); //! adding the object to the form controls
               lblRows->BringToFront(); //! bringing the object on top of other ones

               numRowsTextBox = gcnew TextBox(); //! textbox for input of the row count
               numRowsTextBox->Location = Point(396, 700);
               numRowsTextBox->Size = System::Drawing::Size(100, 30);
               numRowsTextBox->ForeColor = Color::White;
               numRowsTextBox->Text = "10";
               numRowsTextBox->Font = gcnew System::Drawing::Font(L"a_Rewinder", 20, System::Drawing::FontStyle::Regular);
               numRowsTextBox->BackColor = Color::FromArgb(176, 100, 124);
               numRowsTextBox->BorderStyle = BorderStyle::None;
               this->Controls->Add(numRowsTextBox);
               numRowsTextBox->BringToFront();

               lblCols = gcnew Label(); //! label "cols: "
               lblCols->Location = Point(535, 697);
               lblCols->BackColor = System::Drawing::Color::FromArgb(254, 248, 150, 181);
               lblCols->AutoSize = true;
               lblCols->Font = loadedFont->Font;
               lblCols->ForeColor = Color::White;
               lblCols->Text = "cols";
               Controls->Add(lblCols);
               lblCols->BringToFront();

               numColsTextBox = gcnew TextBox();//! textbox for the input of the column count
               numColsTextBox->Location = Point(620, 700);
               numColsTextBox->Size = System::Drawing::Size(100, 30);
               numColsTextBox->ForeColor = Color::White;
               numColsTextBox->Text = "10";
               numColsTextBox->Font = gcnew System::Drawing::Font(L"a_Rewinder", 20, System::Drawing::FontStyle::Regular);
               numColsTextBox->BackColor = Color::FromArgb(176, 100, 124);
               numColsTextBox->BorderStyle = BorderStyle::None;
               this->Controls->Add(numColsTextBox);
               numColsTextBox->BringToFront();

               numBombsTextBox = gcnew TextBox(); //! textbox for the input of the mine (bomb) count
               numBombsTextBox->Location = Point(840, 700);
               numBombsTextBox->Size = System::Drawing::Size(100, 30);
               numBombsTextBox->ForeColor = Color::White;
               numBombsTextBox->Text = "10";
               numBombsTextBox->Font = gcnew System::Drawing::Font(L"a_Rewinder", 20, System::Drawing::FontStyle::Regular);
               numBombsTextBox->BackColor = Color::FromArgb(176, 100, 124);
               numBombsTextBox->BorderStyle = BorderStyle::None;
               this->Controls->Add(numBombsTextBox);
               numBombsTextBox->BringToFront();

               lblCustomField = gcnew Label();//! label that stays on top of the "NEW GAME" button and activates it upon clicking
               lblCustomField->Location = Point(10, 215);
               lblCustomField->Size = System::Drawing::Size(260, 50);
               lblCustomField->Text = "NEW GAME";
               lblCustomField->Click += gcnew EventHandler(this, &MyForm::lblCustomClick); //!  EventHandler is the link between an event (like a label click in that case) and what happens in the code when that event occurs. In that case, the lblCustomClick method is being called
               lblCustomField->Font = loadedFontBigger->Font;
               lblCustomField->BackColor = System::Drawing::Color::FromArgb(255, 121, 159);
               lblCustomField->ForeColor = Color::White;
               lblCustomField->FlatStyle = FlatStyle::Flat;
               this->Controls->Add(lblCustomField);


               generateCustomFieldButton = gcnew CustomButton();//! "NEW GAME" button, for initializing a grid with the desired from the player specifics 
               generateCustomFieldButton->Location = Point(10, 230);
               generateCustomFieldButton->Size = System::Drawing::Size(180, 50);
               generateCustomFieldButton->Click += gcnew EventHandler(this, &MyForm::GenerateCustomFieldButton_Click);
               generateCustomFieldButton->Font = loadedFontBigger->Font;
               generateCustomFieldButton->ForeColor = Color::White;
               generateCustomFieldButton->BackColor = System::Drawing::Color::FromArgb(255, 121, 159);
               generateCustomFieldButton->FlatStyle = FlatStyle::Flat;
               generateCustomFieldButton->FlatAppearance->BorderSize = 0;
         
               this->Controls->Add(generateCustomFieldButton);


               lblSettings = gcnew Label();//! "Settings: " label
               lblSettings->Location = Point(20, 695);
               lblSettings->BackColor = System::Drawing::Color::FromArgb(254,248,150, 181);
               lblSettings->AutoSize = true;
               lblSettings->Font = loadedFontBigger->Font;
               lblSettings->ForeColor = Color::White;
               lblSettings->Text = "Settings ";
               Controls->Add(lblSettings);
               lblSettings->BringToFront();

               lblCustomField->BringToFront();
           }
           /**        
           * Initializes the left-side menu of the interface, containing "Save" game, "Load" saved game "Exit" the project buttons
           */
           void MyForm::InitializeMenuUI() 
           {

               lblSave = gcnew Label(); //! "SAVE" label 
               lblSave->TextAlign = ContentAlignment::MiddleCenter;
               lblSave->Text = "SAVE";
               lblSave->Location = Point(10, 284);
               lblSave->Size = System::Drawing::Size(200, 50);
               lblSave->Font = loadedFontBigger->Font;
               lblSave->ForeColor = Color::White;
               lblSave->BackColor = System::Drawing::Color::FromArgb(248, 150, 182);
               lblSave->Click += gcnew EventHandler(this, &MyForm::lblSaveClick);
               this->Controls->Add(lblSave);


               btnSave = gcnew CustomButton(); //! button that activates upon clicking the "SAVE" label - saves the game state in a .txt file
               btnSave->Location = Point(10, 306);
               btnSave->Size = System::Drawing::Size(200, 50);
               btnSave->Font = loadedFontBigger->Font;
               btnSave->ForeColor = Color::White;
               btnSave->Click += gcnew EventHandler(this, &MyForm::SaveGameState);
               this->Controls->Add(btnSave);

               lblLoad = gcnew Label(); //! "LOAD" label 
               lblLoad->TextAlign = ContentAlignment::MiddleCenter;
               lblLoad->Text = "LOAD";
               lblLoad->Font = loadedFontBigger->Font;
               lblLoad->Location = Point(10, 351); 
               lblLoad->Size = System::Drawing::Size(200, 50);
               lblLoad->ForeColor = Color::White;
               lblLoad->BackColor = System::Drawing::Color::FromArgb(248, 150, 182);
               lblLoad->Click += gcnew EventHandler(this, &MyForm::LoadGameState);
               this->Controls->Add(lblLoad);

               btnLoad = gcnew CustomButton(); //! button that activates upon clicking the "LOAD" label - loads the game state from a .txt file
               btnLoad->Font = loadedFontBigger->Font;
               btnLoad->Location = Point(10, 365); 
               btnLoad->Size = System::Drawing::Size(200, 50);
               btnLoad->ForeColor = Color::White;
               btnLoad->Click += gcnew EventHandler(this, &MyForm::LoadGameState);
               this->Controls->Add(btnLoad);

               lblHint = gcnew Label(); //! "HINT" label
               lblHint->Text = "HINT";
               lblHint->TextAlign = ContentAlignment::MiddleCenter;
               lblHint->Location = Point(10, 419);
               lblHint->Font = loadedFontBigger->Font;
               lblHint->Size = System::Drawing::Size(200, 50);
               lblHint->ForeColor = Color::White;
               lblHint->BackColor = System::Drawing::Color::FromArgb(248, 150, 182);
               lblHint->Click += gcnew EventHandler(this, &MyForm::lblHintClick);
               this->Controls->Add(this->lblHint);

               btnHint = gcnew CustomButton(); //! button that activates upon clicking the "HINT" label - clicks on a random non-mine button
               btnHint->Location = Point(10, 421);
               btnHint->Font = loadedFontBigger->Font;
               btnHint->Size = System::Drawing::Size(200, 50);
               btnHint->ForeColor = Color::White;
               btnHint->Click += gcnew EventHandler(this, &MyForm::HintClick);
               this->Controls->Add(this->btnHint);

               lblExit = gcnew Label(); //! "EXIT" label
               lblExit->Text = "EXIT";
               lblExit->TextAlign = ContentAlignment::MiddleCenter;
               lblExit->Font = loadedFontBigger->Font;
               lblExit->Size = System::Drawing::Size(200, 50);
               lblExit->Location = Point(10, 481);
               lblExit->ForeColor = Color::White;
               lblExit->BackColor = System::Drawing::Color::FromArgb(248, 150, 182);
               lblExit->Click += gcnew System::EventHandler(this, &MyForm::ExitLabel_Click);
               this->Controls->Add(lblExit);

               btnExit = gcnew CustomButton(); //! button that activates upon clicking the "EXIT" label - quits the form
               btnExit->Text = "";
               btnExit->Font = loadedFontBigger->Font;
               btnExit->Size = System::Drawing::Size(200, 50);
               btnExit->Location = Point(10, 440);
               btnExit->ForeColor = Color::White;
               btnExit->Click += gcnew System::EventHandler(this, &MyForm::ExitButton_Click);
               this->Controls->Add(btnExit);

               lblSave->BringToFront();
               lblLoad->BringToFront();
               lblHint->BringToFront();
               lblExit->BringToFront();

           }


           void MyForm::lblHintClick(System::Object^ sender, System::EventArgs^ e)
           {
               btnHint->PerformClick(); //! clicks the btnHint button
           }
           void MyForm::lblSaveClick(System::Object^ sender, System::EventArgs^ e)
           {
               btnSave->PerformClick();
           }
           void MyForm::lblLoadClick(System::Object^ sender, System::EventArgs^ e)
           {
               btnLoad->PerformClick();
           }
           void MyForm::lblCustomClick(Object^ sender, EventArgs^ e) {
               generateCustomFieldButton->PerformClick();
           }

           /**
           * initializes the statistics pannel, the right pannel in the UI - the rest of the specifics are explained in GameStatistics class
           */
           void MyForm::InitializeStatisticsUI() {
               System::Drawing::Font^ newFont = gcnew System::Drawing::Font("Arial", 15);

               lblStatistics = gcnew Label(); //"Statistics" label
               lblStatistics->Location = Point(920, 170);
               lblStatistics->AutoSize = true;
               lblStatistics->Font = loadedFontBigger->Font;
               lblStatistics->Text = "Statistics";
               lblStatistics->ForeColor = Color::White;
               lblStatistics->BackColor = System::Drawing::Color::FromArgb(255, 254, 211, 230);
               Controls->Add(lblStatistics);

               lblBestTime = gcnew Label(); 
               lblBestTime->Location = Point(900, 250);
               lblBestTime->AutoSize = true;
               lblBestTime->ForeColor = System::Drawing::Color::White;
               lblBestTime->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);;
               lblBestTime->BackColor = System::Drawing::Color::FromArgb(255, 254, 211, 230);
               Controls->Add(lblBestTime);

               lblGamesPlayed = gcnew Label();
               lblGamesPlayed->Location = Point(900, 350);
               lblGamesPlayed->AutoSize = true;
               lblGamesPlayed->ForeColor = System::Drawing::Color::White;
               lblGamesPlayed->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);
               lblGamesPlayed->BackColor = System::Drawing::Color::FromArgb(255, 252, 210, 220);
               Controls->Add(lblGamesPlayed);

               lblGamesWon = gcnew Label();
               lblGamesWon->Location = Point(900, 300);
               lblGamesWon->AutoSize = true;
               lblGamesWon ->ForeColor = System::Drawing::Color::White;
               lblGamesWon->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);;
               lblGamesWon->BackColor = System::Drawing::Color::FromArgb(255, 254, 211, 230);
               Controls->Add(lblGamesWon);

               lblWinPercentage = gcnew Label();
               lblWinPercentage->Location = Point(900, 400);
               lblWinPercentage->AutoSize = true;
               lblWinPercentage->ForeColor = System::Drawing::Color::White;
               lblWinPercentage->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);
               lblWinPercentage->BackColor = System::Drawing::Color::FromArgb(255, 252, 210, 220);
               Controls->Add(lblWinPercentage);

               lblLongestWinStreak = gcnew Label();
               lblLongestWinStreak->Location = Point(900, 450);
               lblLongestWinStreak->AutoSize = true;
               lblLongestWinStreak->ForeColor = System::Drawing::Color::White;
               lblLongestWinStreak->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);
               lblLongestWinStreak->BackColor = System::Drawing::Color::FromArgb(255, 252, 210, 220);
               Controls->Add(lblLongestWinStreak);

               lblLongestLoseStreak = gcnew Label();
               lblLongestLoseStreak->Location = Point(900, 500);
               lblLongestLoseStreak->AutoSize = true;
               lblLongestLoseStreak->ForeColor = System::Drawing::Color::White;
               lblLongestLoseStreak->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);;
               lblLongestLoseStreak->BackColor = System::Drawing::Color::FromArgb(255, 252, 210, 220);
               Controls->Add(lblLongestLoseStreak);

               lblCurrentStreak = gcnew Label();
               lblCurrentStreak->Location = Point(900, 550);
               lblCurrentStreak->AutoSize = true;
               lblCurrentStreak->ForeColor = System::Drawing::Color::White;
               lblCurrentStreak->Font = gcnew System::Drawing::Font(L"a_Rewinder", 18, System::Drawing::FontStyle::Regular);;
               lblCurrentStreak->BackColor = System::Drawing::Color::FromArgb(255, 252, 210, 220);
               Controls->Add(lblCurrentStreak);

               lblStatistics->BringToFront();
               lblBestTime->BringToFront();
               lblWinPercentage->BringToFront();
               lblGamesWon->BringToFront();
               lblLongestLoseStreak->BringToFront();
               lblLongestWinStreak->BringToFront();
               lblCurrentStreak->BringToFront();
               lblGamesPlayed->BringToFront();
           }

           /**
           * initializes the timer that tracks the current game's time
           */
           void MyForm::InitializeTimer() {
               lblTimer = gcnew Label();
               lblTimer->Location = Point(320, 30);
               lblTimer->BackColor = System::Drawing::Color::FromArgb(254, 246, 150, 177);
               lblTimer->AutoSize = true;
               lblTimer->Font = loadedFontBigger->Font;
               lblTimer->ForeColor = Color::White;
               lblTimer->Text = "Current Time";
               Controls->Add(lblTimer);
               lblTimer->BringToFront();


               gameTimer = gcnew Timer();
               gameTimer->Interval = 1000;
               gameTimer->Tick += gcnew EventHandler(this, &MyForm::gameTimer_Tick);

               elapsedTimeLabel = gcnew Label();
               elapsedTimeLabel->Location = Point(630, 33);
               elapsedTimeLabel->AutoSize = true;
               elapsedTimeLabel->ForeColor = System::Drawing::Color::White;
               elapsedTimeLabel->BackColor = System::Drawing::Color::FromArgb(254, 246, 150, 177);
               elapsedTimeLabel->Font = gcnew System::Drawing::Font(L"a_Rewinder", 30, System::Drawing::FontStyle::Regular);

               this->Controls->Add(elapsedTimeLabel);
               elapsedTimeLabel->BringToFront();
           }
           /**
           * initializes the images used in the interface
           */
           void MyForm::InitializePictures() {
               //! time pannel
               Bitmap^ imageTimePannel = gcnew Bitmap("Time_Pannel.png");
               timePannelPicBox->Image = imageTimePannel;
               timePannelPicBox->Size = System::Drawing::Size(600, 90);
               timePannelPicBox->SizeMode = PictureBoxSizeMode::StretchImage; 
               timePannelPicBox->Location = Point(280, 0);
               this->Controls->Add(timePannelPicBox);

         

               //! settings pannel
               Bitmap^ imagePannel = gcnew Bitmap("Settings_Pannel.png");
               settingsPannelPicBox->Image = imagePannel;
               settingsPannelPicBox->Size = System::Drawing::Size(1184, 120);
               settingsPannelPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               settingsPannelPicBox->Location = Point(0, 680);
               this->Controls->Add(settingsPannelPicBox);

               //! logo 
               Bitmap^ imageLogo = gcnew Bitmap("Logo.png");
               logoPicBox->Image = imageLogo;
               logoPicBox->Size = System::Drawing::Size(220, 110);
               logoPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               logoPicBox->Location = Point(5, 5);
               this->Controls->Add(logoPicBox);


               //! value input pannel - row count
               Bitmap^ imageValueInput = gcnew Bitmap("Value_Input_Pannel.png");
               valueInputPannelPicBox->Image = imageValueInput;
               valueInputPannelPicBox->Size = System::Drawing::Size(104,40);
               valueInputPannelPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               valueInputPannelPicBox->Location = Point(394, 698);
               this->Controls->Add(valueInputPannelPicBox);
               valueInputPannelPicBox->SendToBack();

               //! value input pannel - column count
               Bitmap^ imageValueInput2 = gcnew Bitmap("Value_Input_Pannel.png");
               valueInputPannelPicBox2->Image = imageValueInput2;
               valueInputPannelPicBox2->Size = System::Drawing::Size(104, 40);
               valueInputPannelPicBox2->SizeMode = PictureBoxSizeMode::StretchImage;
               valueInputPannelPicBox2->Location = Point(617, 698);
               this->Controls->Add(valueInputPannelPicBox2);
               valueInputPannelPicBox2->SendToBack();

               //! value input pannel - mine count
               Bitmap^ imageValueInput3 = gcnew Bitmap("Value_Input_Pannel.png");
               valueInputPannelPicBox3->Image = imageValueInput3;
               valueInputPannelPicBox3->Size = System::Drawing::Size(104, 40);
               valueInputPannelPicBox3->SizeMode = PictureBoxSizeMode::StretchImage;
               valueInputPannelPicBox3->Location = Point(837, 698);
               this->Controls->Add(valueInputPannelPicBox3);
               valueInputPannelPicBox3->SendToBack();

               //! mine (bomb) image, next to the mine count input pannel
               Bitmap^ imageBomb = gcnew Bitmap("Mine.png");
               bombPicBox->Image = imageBomb;
               bombPicBox->Size = System::Drawing::Size(50, 50);
               bombPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               bombPicBox->Location = Point(770, 694);
               this->Controls->Add(bombPicBox);
               bombPicBox->SendToBack();


               //! "NEW GAME" button image
               Bitmap^ mainSideButton = gcnew Bitmap("Button_2.png");
               mainSideBtnPicBox->Image = mainSideButton;
               mainSideBtnPicBox->Size = System::Drawing::Size(290, 70);
               mainSideBtnPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               mainSideBtnPicBox->Location = Point(0, 210);
               this->Controls->Add(mainSideBtnPicBox);

               //! "SAVE" button image
               Bitmap^ sideButton = gcnew Bitmap("Button_1.png");
               sideBtnPicBox->Image = sideButton;
               sideBtnPicBox->Size = System::Drawing::Size(250, 70);
               sideBtnPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               sideBtnPicBox->Location = Point(0, 341);
               this->Controls->Add(sideBtnPicBox);

               //! "LOAD" button image
               Bitmap^ sideButton2 = gcnew Bitmap("Button_1.png");
               sideBtnPicBox2->Image = sideButton2;
               sideBtnPicBox2->Size = System::Drawing::Size(250, 70);
               sideBtnPicBox2->SizeMode = PictureBoxSizeMode::StretchImage;
               sideBtnPicBox2->Location = Point(0, 408);
               this->Controls->Add(sideBtnPicBox2);

               //! "HINT" button image
               Bitmap^ sideButton3 = gcnew Bitmap("Button_1.png");
               sideBtnPicBox3->Image = sideButton3;
               sideBtnPicBox3->Size = System::Drawing::Size(250, 70);
               sideBtnPicBox3->SizeMode = PictureBoxSizeMode::StretchImage;
               sideBtnPicBox3->Location = Point(0, 475);
               this->Controls->Add(sideBtnPicBox3);

               //! "EXIT" button image
               Bitmap^ sideButton4 = gcnew Bitmap("Button_1.png");
               sideBtnPicBox4->Image = sideButton4;
               sideBtnPicBox4->Size = System::Drawing::Size(250, 70);
               sideBtnPicBox4->SizeMode = PictureBoxSizeMode::StretchImage;
               sideBtnPicBox4->Location = Point(0, 275);
               this->Controls->Add(sideBtnPicBox4);

               //! statistics pannel image
               Bitmap^ statisticsPannel = gcnew Bitmap("Statistics_pannel.jpg");
               statisticsPannelPicBox->Image = statisticsPannel;
               statisticsPannelPicBox->Size = System::Drawing::Size(290, 440);
               statisticsPannelPicBox->SizeMode = PictureBoxSizeMode::StretchImage;
               statisticsPannelPicBox->Location = Point(890, 155);
               this->Controls->Add(statisticsPannelPicBox);
               
               statisticsPannelPicBox->SendToBack(); //! sending the images behind the text
               settingsPannelPicBox->SendToBack();
               mainSideBtnPicBox->SendToBack();

           }

           /**
           * generates the grid of buttons with the desired row, col and mine count, or from a file with data for each button
           */
           void MyForm::GenerateMatrixOfButtons(int rows, int cols, int numBombs, array <array <bool>^ >^ mineData, array <array <bool>^ >^ revealedData, array <array <bool>^ >^ flaggedData) 
           {
               const int buttonSize = 28; 
               const int padding = 1;
               const int leftTotalPadding = (formWidth - (cols * (buttonSize + padding) - padding)) / 2 - rows;
               const int topTotalPadding = (formHeight - (rows * (buttonSize + padding) - padding)) / 2 - 20;
               mineField = gcnew MineField(rows, cols, numBombs); //! initializes a MineField with the desired row, col and mine count
               mineField->InitializeField();
               gameTimer->Stop(); //! restarts the game timer
               elapsedTimeInSeconds = 0;
               for (int i = 0; i < rows; ++i) {
                   for (int j = 0; j < cols; ++j) {
                       MineButton^ button = gcnew MineButton(i, j);
                       button->Size = System::Drawing::Size(buttonSize, buttonSize);
                       button->Font = gcnew System::Drawing::Font(L"a_Rewinder", 15, System::Drawing::FontStyle::Regular);
                       button->ForeColor = System::Drawing::Color::White;
                       button->Location = Point(leftTotalPadding + padding + j * (buttonSize + padding), topTotalPadding + padding + i * (buttonSize + padding));
                       button->MouseDown += gcnew MouseEventHandler(this, &MyForm::MineButtonClick);
                       this->Controls->Add(button);
                       mineField->SetButton(i, j, button);

                       if (mineData != nullptr && mineData[i][j]) { //! if there is given data (from a text file) it uses it to create the desired buttons
                           button->IsMine = true;
                           mineField->AddMine(i, j);
                           button->AdjacentMines = mineField->GetAdjacentMineCount(i, j);
                       }

                       if (revealedData != nullptr && revealedData[i][j]) {
                           button->IsRevealed = true;
                           if (button->IsMine) {
                               Bitmap^ uncoveredImage = gcnew Bitmap("Slot_Uncovered_Mine.png");
                               button->Image = uncoveredImage;
                           }
                           else {
                               Bitmap^ uncoveredImage = gcnew Bitmap("Slot_Uncovered.png");
                               button->Image = uncoveredImage;
                           }

                           if(mineField->GetAdjacentMineCount(i,j)!=0) button->Text = mineField->GetAdjacentMineCount(i, j).ToString();
                       }

                       if (flaggedData != nullptr && flaggedData[i][j]) {
                           button->IsFlagged = true;
                           Bitmap^ uncoveredImage = gcnew Bitmap("Slot_Uncovered_Flag.png");
                           button->Image = uncoveredImage;
                       }
                   }
               }

               if (mineData == nullptr) { //! if there is no data given, for where each mine should be, they get placed at random places across the board
                   Random^ random = gcnew Random();
                   int bombsPlaced = 0;
                   while (bombsPlaced < numBombs) {
                       int row = random->Next(rows);
                       int col = random->Next(cols);
                       MineButton^ button = mineField->GetButton(row, col);
                       button->AdjacentMines = 0;

                       if (!button->IsMine) {
                           button->IsMine = true;
                           mineField->AddMine(row, col);
                           ++bombsPlaced;
                       }
                   }
               }

               for (int i = 0; i < rows; ++i) {
                   for (int j = 0; j < cols; ++j) {
                       MineButton^ button = mineField->GetButton(i, j);

                       if (!button->IsMine) {
                           button->AdjacentMines = mineField->GetAdjacentMineCount(i, j);
                       }
                   }
               }
           }

           void MyForm::DeleteMatrixOfButtons() { //! removes the old grid upon creating a new one
               if (mineField == nullptr) {
                   return;
               }

               for (int i = 0; i < mineField->GetNumRows(); ++i) {
                   for (int j = 0; j < mineField->GetNumCols(); ++j) {
                       MineButton^ button = mineField->GetButton(i, j);
                       this->Controls->Remove(button);
                       delete button;
                   }
               }

               mineField = nullptr;
           }
           /**
           * the functionality for each mine button on the field - separated into right and left click
           */
           void MyForm::MineButtonClick(Object^ sender, MouseEventArgs^ e) {
               MineButton^ clickedButton = safe_cast <MineButton^> (sender); //! from ChatGPT
               if (clickedButton->IsDisabled) return;
               if (!gameTimer->Enabled) {
                   gameTimer->Start();
               }

               if (e->Button == System::Windows::Forms::MouseButtons::Left) {
                   LeftClickAction(clickedButton);
               }
               else if (e->Button == System::Windows::Forms::MouseButtons::Right) {
                   RightClickAction(clickedButton);
               }
           }

           /**
           * mine button functionality for when a left mouse click is performed
           */
           void MyForm::LeftClickAction(MineButton^ clickedButton) {
               if (clickedButton->IsDisabled) return;
               System::Media::SoundPlayer^ soundPlayer = gcnew System::Media::SoundPlayer(); //! sound play
      
               if (clickedButton->IsFlagged || clickedButton->IsRevealed) {
                   return;
               }

               if (clickedButton->IsMine) {

                   gameStats->gamesPlayed++;
                   soundPlayer->SoundLocation = "bombClick.wav"; //! if the button contains a mine, a bomb sound is activated
                   soundPlayer->Load();
                   soundPlayer->Play();

                   Bitmap^ bombImage = gcnew Bitmap("Slot_Uncovered_Mine.png"); //! the image on the button changes to a mine image
                   clickedButton->Image = bombImage;
                   EndGame(false); //! the game ends as a loss

               }
               else {
                   soundPlayer->SoundLocation = "fieldClick.wav";
                   soundPlayer->Load();
                   soundPlayer->Play();
                   RevealButton(clickedButton); //! the button image changes to an uncovered button image

                   if (CheckWin()) {
                       gameStats->gamesPlayed++;
                       gameStats->gamesWon++;
                       EndGame(true); //! the game ends as a victory
                   }

               }
           }
           /**
           * mine button functionality for when a right mouse click is performed - the button becomes "flagged" as a potential mine
           */
           void MyForm::RightClickAction(MineButton^ clickedButton) { //
               if (clickedButton->IsDisabled) return;
               System::Media::SoundPlayer^ soundPlayer = gcnew System::Media::SoundPlayer();
               soundPlayer->SoundLocation = "flagClick.wav"; //! sound play for flagging a button
               soundPlayer->Load();
               soundPlayer->Play();
               clickedButton->IsFlagged = !clickedButton->IsFlagged;

               if (clickedButton->IsFlagged) { //! if the button is already flagged, it becomes unflagged and vice versa
                   Bitmap^ coveredImage = gcnew Bitmap("Slot_Uncovered_Flag.png");
                   clickedButton->Image = coveredImage;
               }
               else {
                   clickedButton->Text = "";
                   Bitmap^ coveredImage = gcnew Bitmap("Slot_Covered.png");
                   clickedButton->Image = coveredImage;
               }

           }

           /**
           * "reveals" the button 
           */
           void MyForm::RevealButton(MineButton^ button) {
               if (button->IsFlagged || button->IsRevealed){ //! the method works only if the button is not already revealed (or flagged)
                   return;
               }
              
               if (button->AdjacentMines > 0) //! if there are adjacent mines, shows their count
               {
                   button->Text = button->AdjacentMines.ToString();
               }

               button->IsRevealed = true;
               button->DisableButton(); //! disables the button (can't be clicked more than once)
               button->Font = gcnew System::Drawing::Font(L"a_Rewinder", 15, System::Drawing::FontStyle::Regular);
               button->ForeColor = System::Drawing::Color::White;
               Bitmap^ uncoveredImage = gcnew Bitmap("Slot_Uncovered.png"); //! changes the image on the button
               button->Image = uncoveredImage;


               if (button->AdjacentMines > 0) {
                   button->Text = button->AdjacentMines.ToString();
               }

               Random^ rand = gcnew Random();                  
               int maxAmountOfFieldsToBeRevealed = rand->Next(0, (mineField->GetNumRows()+mineField->GetNumCols())/4); 

               int currentlyRevealedFields = 0;

               for (int i = -1; i <= 1; ++i) { //! reveals a random number of neighboring non-mine buttons via recursion
                   for (int j = -1; j <= 1; ++j) {
                       if (i == 0 && j == 0) continue;

                       int newRow = button->Row + i;
                       int newCol = button->Col + j;

                       if (newRow >= 0 && newRow < mineField->GetNumRows() && newCol >= 0 && newCol < mineField->GetNumCols() && !mineField->GetButton(newRow, newCol)->IsMine && currentlyRevealedFields <= maxAmountOfFieldsToBeRevealed) {
                           currentlyRevealedFields++;
                           RevealButton(mineField->GetButton(newRow, newCol));
                       }
                   }
               }

           }
           /**
           * generates a grid with the desired numbers of rows, columns and mines, as long as the desired input is valid
           */
           void MyForm::GenerateCustomFieldButton_Click(Object^ sender, EventArgs^ e) {
               Button^ button = safe_cast<Button^>(sender);
               button->Font = gcnew System::Drawing::Font("Arial", 106);
               int numRows, numCols, numBombs;
               if (!int::TryParse(numRowsTextBox->Text, numRows) || !int::TryParse(numColsTextBox->Text, numCols) || !int::TryParse(numBombsTextBox->Text, numBombs)) {
                   MessageBox::Show("Input should be valid (grid should be between 1x1 and 20x20, and bomb count can't be greater than tiles count)");
                   return;
               }

               numRows = Int32::Parse(numRowsTextBox->Text);
               numCols = Int32::Parse(numColsTextBox->Text);
               numBombs = Int32::Parse(numBombsTextBox->Text);

               if (numRows <= 0 || numRows > 20 || numCols <= 0 || numCols > 20 || numRows * numCols <= numBombs || numBombs <= 0) {
                   MessageBox::Show("Input should be valid (grid should be between 1x1 and 20x20, and bomb count can't be greater than tiles count)");
               }
               else {
                   DeleteMatrixOfButtons();
                   GenerateMatrixOfButtons(numRows, numCols, numBombs, nullptr, nullptr, nullptr);
               }
           }
           /**
           * checks if all the non-mine fields are uncovered
           */
           bool MyForm::CheckWin() {
               int revealedButtons = 0;
               for (int i = 0; i < mineField->GetNumRows(); ++i) {
                   for (int j = 0; j < mineField->GetNumCols(); ++j) {
                       MineButton^ button = mineField->GetButton(i, j);
                       if (button->IsRevealed) {
                           ++revealedButtons;
                       }
                   }
               }

               return revealedButtons == (mineField->GetNumRows() * mineField->GetNumCols()) - mineField->GetNumBombs();
           }

           /**
           * ends the game as a win or as a loss
           */
           void MyForm::EndGame(bool isWin) {
               gameTimer->Stop();
               if (isWin) {
                   MessageBox::Show("Congratulations! You won the game!", "Pinksweeper", MessageBoxButtons::OK, MessageBoxIcon::None);
                   if (gameStats->winStreak) {
                       gameStats->currentStreak++;
                       if (gameStats->longestWinStreak < gameStats->currentStreak) gameStats->longestWinStreak = gameStats->currentStreak;
                   }
                   else {
                       gameStats->winStreak = true;
                       gameStats->currentStreak = 0;
                   }
                   int elapsedTime = ParseTimeToSeconds(elapsedTimeLabel->Text);
                   if (elapsedTime > 0 && elapsedTime < gameStats->bestTime) {
                       gameStats->bestTime = elapsedTime;
                   }
               }
               else {
                   MessageBox::Show("You clicked on a bomb! Game over.", "Pinksweeper", MessageBoxButtons::OK, MessageBoxIcon::None);
                   if (!gameStats->winStreak) {
                       gameStats->currentStreak++;
                       if (gameStats->longestLoseStreak < gameStats->currentStreak) gameStats->longestLoseStreak = gameStats->currentStreak;
                   }
                   else {
                       gameStats->winStreak = false;
                       gameStats->currentStreak = 0;
                   }
               }
               for (int i = 0; i < mineField->GetNumRows(); ++i) {
                   for (int j = 0; j < mineField->GetNumCols(); ++j) {
                       MineButton^ button = mineField->GetButton(i, j);
                       button->IsDisabled = true;
                       if (button->IsMine) {
                           button->Text = "";
                           Bitmap^ uncoveredImage = gcnew Bitmap("Slot_Uncovered_Mine.png");
                           button->Image = uncoveredImage;
                       }
                   }
               }
              
               gameStats->winPercentage = (double)gameStats->gamesWon / gameStats->gamesPlayed * 100;
               UpdateStatisticLabels(gameStats); //! changes the statistics depending on the last played game status
               SaveStatistics(gameStats);

           }

           /**
           * a "hint" to the player - acts like a left click on a random non-mine button
           */
            void HintClick(Object^ sender, EventArgs^ e) {
                bool found = false;
                int x, y;
                bool containsEnabledButtons = false;
                for (int i = 0; i < mineField->GetNumRows(); i++) {
                    for (int j = 0; j < mineField->GetNumCols(); j++) {
                        if (!mineField->GetButton(i, j)->IsDisabled) containsEnabledButtons = true;
                    }
                }
                if (!containsEnabledButtons) return;

                Random^ rand = gcnew Random();

                if (!gameTimer->Enabled) {
                    gameTimer->Start();
                }

                while (!found) {
                    x = rand->Next(0, mineField->GetNumRows());
                    y = rand->Next(0, mineField->GetNumCols());

                    if (!mineField->GetButton(x, y)->IsMine && !mineField->GetButton(x, y)->IsFlagged && !mineField->GetButton(x, y)->IsRevealed) {
                        found = true;
                    }
                }

                RevealButton(mineField->GetButton(x, y));

                if (CheckWin()) {
                    EndGame(true);
                }
        
            }

           /**
           * loads a saved game from a .txt file 
           * @throws "Error loading the game state" if an error occurs during loading the game state
           */
           void MyForm::LoadGameState(Object^ sender, EventArgs^ e) {
               StreamReader^ sr = nullptr;
               try {
                   sr = gcnew StreamReader("gamestate.txt");

                   int numRows = Int32::Parse(sr->ReadLine());
                   int numCols = Int32::Parse(sr->ReadLine());
                   int numBombs = Int32::Parse(sr->ReadLine());

                   array < array <bool>^ >^ mineData = gcnew array < array <bool>^ >(numRows);
                   array < array <bool>^ >^ revealedData = gcnew array < array <bool>^ >(numRows);
                   array < array <bool>^ >^ flaggedData = gcnew array < array <bool>^ >(numRows);
                   for (int i = 0; i < numRows; ++i) {
                       String^ row = sr->ReadLine();
                       mineData[i] = gcnew array < bool >(numCols);
                       revealedData[i] = gcnew array < bool >(numCols);
                       flaggedData[i] = gcnew array < bool >(numCols);
                       for (int j = 0, k = 0; j < numCols; ++j, k += 3) {
                           mineData[i][j] = row[k] == '1';
                           revealedData[i][j] = row[k + 1] == '1';
                           flaggedData[i][j] = row[k + 2] == '1';
                       }
                   }

                   DeleteMatrixOfButtons();
                   GenerateMatrixOfButtons(numRows, numCols, numBombs, mineData, revealedData, flaggedData);
               }
               catch (Exception^ ex) {
                   MessageBox::Show("Error loading the game state: " + ex->Message);
               }
               finally {
                   if (sr != nullptr) {
                       sr->Close();
                   }
               }
           }

           /**
           * saves the current game along with its state in a .txt file - containing data about whether the current button is revealed, is a mine, or is flagged
           * @throws "Error saving the game state" if an error occurs during loading the game state
           */
           void MyForm::SaveGameState(Object^ sender, EventArgs^ e) {
               StreamWriter^ sw = nullptr;
               try {
                   if (mineField->AllButtonsAreDisabled()) {
                       MessageBox::Show("A finished game can't be saved!");
                       return;
                   }
                   sw = gcnew StreamWriter("gamestate.txt");

                   sw->WriteLine(mineField->GetNumRows());
                   sw->WriteLine(mineField->GetNumCols());
                   sw->WriteLine(mineField->GetNumBombs());

                   for (int i = 0; i < mineField->GetNumRows(); ++i) {
                       for (int j = 0; j < mineField->GetNumCols(); ++j) {
                           MineButton^ button = mineField->GetButton(i, j);
                           sw->Write(button->IsMine ? '1' : '0');
                           sw->Write(button->IsRevealed ? '1' : '0');
                           sw->Write(button->IsFlagged ? '1' : '0');
                       }
                       sw->WriteLine();
                   }
               }
               catch (Exception^ ex) {
                   MessageBox::Show("Error saving the game state: " + ex->Message);
               }
               finally {
                   if (sw != nullptr) {
                       sw->Close();
                   }
               }
           }
           /**
           * loads the game statistics from a .txt file 
           * the following statistics are kept track on:
           * best time (for a win)
           * total games played
           * total games won
           * total games lost
           * win percentage
           * longest win streak
           * longest loss streak
           * current streak (whether it's a loss or a win one)
           * @throws "Unable to open statistics.txt for reading" if an error occurs during reading the file
           */
           GameStatistics^ LoadStatistics() {
               GameStatistics^ stats = gcnew GameStatistics();
               try {
                   StreamReader^ inFile = gcnew StreamReader("statistics.txt");
                   stats->bestTime = Int32::Parse(inFile->ReadLine());
                   stats->gamesPlayed = Int32::Parse(inFile->ReadLine());
                   stats->gamesWon = Int32::Parse(inFile->ReadLine());
                   stats->winPercentage = Double::Parse(inFile->ReadLine());
                   stats->longestWinStreak = Int32::Parse(inFile->ReadLine());
                   stats->longestLoseStreak = Int32::Parse(inFile->ReadLine());
                   stats->currentStreak = Int32::Parse(inFile->ReadLine());
                   inFile->Close();
               }
               catch (Exception^ ex) {
                   MessageBox::Show("Unable to open statistics.txt for reading: " + ex->Message);
               }
               return stats;
           }

           /**
           * saves the game statistics in a .txt file
           */
           void SaveStatistics(GameStatistics^ stats) {
               try {
                   StreamWriter^ outFile = gcnew StreamWriter("statistics.txt");
                   outFile->WriteLine(stats->bestTime.ToString());
                   outFile->WriteLine(stats->gamesPlayed.ToString());
                   outFile->WriteLine(stats->gamesWon.ToString());
                   outFile->WriteLine(stats->winPercentage.ToString());
                   outFile->WriteLine(stats->longestWinStreak.ToString());
                   outFile->WriteLine(stats->longestLoseStreak.ToString());
                   outFile->WriteLine(stats->currentStreak.ToString());
                   outFile->Close();
               }
               catch (Exception^ ex) {
                   MessageBox::Show("Unable to open statistics.txt for writing: " + ex->Message);
               }
           }
           /**
           * updates the label (in the interface) with the current game statistics
           */
           void UpdateStatisticLabels(GameStatistics^ stats) {
               lblBestTime->Text = "Best Time: " + stats->bestTimeFormatted();
               lblGamesPlayed->Text = "Games Played: " + stats->gamesPlayed;
               lblGamesWon->Text = "Games Won: " + stats->gamesWon;
               lblWinPercentage->Text = "Win Percentage: " + Math::Round(stats->winPercentage, 0).ToString() + "%";
               lblLongestWinStreak->Text = "Longest Win Streak: " + stats->longestWinStreak;
               lblLongestLoseStreak->Text = "Longest Lose Streak: " + stats->longestLoseStreak;
               lblCurrentStreak->Text = "Current Streak: " + stats->currentStreak;
           }
           /**
           * changes the time passed each second, while a game is played
           */
           void gameTimer_Tick(System::Object^ sender, System::EventArgs^ e) { //chatgpt
               elapsedTimeInSeconds++;
               int hours = elapsedTimeInSeconds / 3600;
               int minutes = (elapsedTimeInSeconds % 3600) / 60;
               int seconds = elapsedTimeInSeconds % 60;
               elapsedTimeLabel->Text = String::Format("{0:D2}:{1:D2}:{2:D2}", hours, minutes, seconds);
           }


           void ExitLabel_Click(System::Object^ sender, System::EventArgs^ e) {
               btnExit->PerformClick();
           }

           /**
           * closes the form
           */
           void ExitButton_Click(System::Object^ sender, System::EventArgs^ e) {
               this->Close();
           }

           /**
           * parses the timer's "HH:mm:ss" format to seconds (integer)
           */
           int ParseTimeToSeconds(String^ timeStr) {
               TimeSpan timeSpan;
               if (TimeSpan::TryParse(timeStr, timeSpan)) {
                   return (int)timeSpan.TotalSeconds;
               }
               else {
                   return -1;
               }
           }

};


}