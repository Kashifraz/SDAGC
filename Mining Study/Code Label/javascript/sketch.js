var roll1;
var roll2;
var total;
var random1x, random1y, random1s;
var shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  roll1 = floor(random(1, 7));
  roll2 = floor(random(1, 21));
  random1x = random(width * 0.22, width);
  random1y = random(height);
  random1s = random(10, height*0.25);
  frameRate(1);

  //background
  background('black');
}

const colourPalette = ['#00FFFF', '#FF6EC7', '#FFD700', '#00FF7F'];

function draw() {
  //background
  stroke(0,0,0,0);
  fill('#010626');
  rect(0, 0, 420, height);
  
  //total (the sum of the 2 dice)
  total = roll1 + roll2;
  fill('#00CED1');
  textFont('American Typewriter', 40);
  text('Total: ' + total, 230, 750);
  text('Click to draw', 15, 50);
  
  //dice1
  fill('#030A8C');
  rect(110, 140, 180, 180, 20);
  textFont('American Typewriter', 100);
  fill('#00CED1');
  
  if (roll1 == 1) {
    text('1', 168, 260);
    
  } else if (roll1 == 2) {
    text('2', 168, 260);
    
  } else if (roll1 == 3) {
    text('3', 168, 260);
    
  } else if (roll1 == 4) {
    text('4', 168, 260);
    
  } else if (roll1 == 5) {
    text('5', 168, 260);

  } else if (roll1 == 6) {
    text('6', 168, 260);
  }
  
  //dice2
  fill('#030A8C');
  
  push();
  translate(200, height * 0.65);
  polygon(0, 0, 120, 6);
  pop();
  
  fill('#00CED1');
  if (roll2 == 1) {
    text('1', 168, 558);
    
  } else if (roll2 == 2) {
    text('2', 168, 558);
    
  } else if (roll2 == 3) {
    text('3', 168, 558);
    
  } else if (roll2 == 4) {
    text('4', 168, 558);
    
  } else if (roll2 == 5) {
    text('5', 168, 558);

  } else if (roll2 == 6) {
    text('6', 168, 558);
    
  } else if (roll2 == 7) {
    text('7', 168, 558);
    
  } else if (roll2 == 8) {
    text('8', 168, 558);
    
  } else if (roll2 == 9) {
    text('9', 168, 558);
    
  } else if (roll2 == 10) {
    text('10', 140, 558);

  } else if (roll2 == 11) {
    text('11', 140, 558);
    
  } else if (roll2 == 12) {
    text('12', 140, 558);
    
  } else if (roll2 == 13) {
    text('13', 140, 558);
    
  } else if (roll2 == 14) {
    text('14', 140, 558);
    
  } else if (roll2 == 15) {
    text('15', 140, 558);

  } else if (roll2 == 16) {
    text('16', 140, 558);
    
  } else if (roll2 == 17) {
    text('17', 140, 558);
    
  } else if (roll2 == 18) {
    text('18', 140, 558);
    
  } else if (roll2 == 19) {
    text('19', 140, 558);
    
  } else if (roll2 == 20) {
    text('20', 140, 558);
  }
}



//draw regular polygon
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

//odd num. draw a circle, even num. draw a square
function drawShapes(total, x, y) {
  total = roll1 + roll2;
  let randomColour = colourPalette[Math.floor(Math.random() * colourPalette.length)];
  let randomSize = Math.floor(Math.random() * 150);

   drawingContext.shadowColor = randomColour;
   drawingContext.shadowBlur = 10;

  if (total % 2 == 1){
    fill(randomColour);
    circle(x, y, randomSize); 
  }
  if (total % 2 == 0){
    fill(randomColour);
    square(x, y, randomSize); 
  }

  drawingContext.shadowColor = 0;
  drawingContext.shadowBlur = 0;
}

function drawFlower(){
  total = roll1 + roll2;
  let randomColour = colourPalette[Math.floor(Math.random() * colourPalette.length)];

  drawingContext.shadowColor = randomColour;
  drawingContext.shadowBlur = 10;

   if (total >= 20){
    fill(randomColour);
    translate(random1x, random1y);
    noStroke();
    for (let i = 0; i < 10; i ++) {
      ellipse(0, 30, 10, 40);
      rotate(PI/5);
    }
  }

  drawingContext.shadowColor = 0;
  drawingContext.shadowBlur = 0;
}


function mousePressed() {
  roll1 = floor(random(1, 7));
  roll2 = floor(random(1, 21));
  random1x = random(width);
  random1y = random(height);

  if (roll1 + roll2 >= 20) {
    drawFlower();
  } else {
    drawShapes(roll1 + roll2, random1x, random1y);
  }
}

//References:
//https://editor.p5js.org/xinxin/sketches/y6p2f0lcf
//https://editor.p5js.org/2sman/sketches/BJcff_nnW
//Also coded with the help of GitHub Copilot
