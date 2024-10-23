var wigglyLetter=[];
var letter, size, rand, speed, xpostion, yposition;

function setup() {
createCanvas(windowWidth, windowHeight);
background(0);
textSize(32);
textFont("Times");
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  for(var i=0; i<wigglyLetter.length; i++){
    wigglyLetter[i].display();
    wigglyLetter[i].giggle();
  }

}

function mousePressed() {
  rand = int(random(65,160));
  letter = char(rand);
  size=32;
  //text(letter, mouseX,mouseY);
  wigglyLetter.push (new Wiggle (mouseX, mouseY,size,letter,speed));
}
class Wiggle {
  constructor(x,y,size,speed){
    this.x=x
    this.y=y;
    this.textSize=size;
    this.speed=speed;
    this.letter=letter
  }
  giggle(){
    this.x+=random(-4,4);
    this.textSize+=random(-20,20)
    this.y+=random(-4,4);
  }
  display(){
    textSize(this.textSize);
    text(this.letter,this.x,this.y);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
