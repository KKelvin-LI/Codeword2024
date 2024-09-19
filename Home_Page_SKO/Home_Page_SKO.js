let messages = [ "Welcome to my Studio Knowledge Object of Creative Coding", "hell0", "hi world" ]; 

function preload(){
  //AvenirRoman = loadFont('data/Avenir-Roman-12.ttf');
  pic = loadImage('data/Chicken.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  textAlign(CENTER,CENTER);
  imageMode(CENTER);
}

function draw() {
  background("white")
  textSize(40);
  textFont ("Arial");
  text("Do you want to see whats next? Click the chicken",windowWidth/2, windowHeight/1.3);
 //reference chatgbt 4.0
  let x = width/2
  let y = height/2
  image(pic,x,y,200,400);
}

  
function mousePressed() {
   let x = width/2
   let y = height/2
   let picMouseX = mouseX - (x - 200/2);
   let picMouseY = mouseY - (y - 400/2);
   
   if (picMouseX >= 0 && picMouseX < 200 && 
   picMouseY >= 0 && picMouseY > 400){
     
   let alphaValue = pic.get(picMouseX, picMouseY)[3];
   if (alphaValue > 0) { 
     let randomMessage = random(messages);
     let randomW = random(50, width - 50);
     let randomY = random(50, height - 50);
     let randomFontSize = random(10,30);
     textSize(randomFontSize);
     text(randomMessage, randomX, randomY);
     }
   }
}
