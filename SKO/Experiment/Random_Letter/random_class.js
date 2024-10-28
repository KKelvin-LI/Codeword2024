let wigglyLetter = [];
let letter, size, rand, speed, xPosition, yPosition;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(width * 0.03); // Text size proportional to window width
  textFont("Times");
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  for (let i = 0; i < wigglyLetter.length; i++) {
    wigglyLetter[i].display();
    wigglyLetter[i].giggle();
  }
}

function mousePressed() {
  rand = int(random(65, 160));
  letter = char(rand);
  size = width * 0.03; // Set initial size proportional to window width
  wigglyLetter.push(new Wiggle(mouseX, mouseY, size, speed));
}

class Wiggle {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.textSize = size;
    this.speed = speed;
    this.letter = letter;
  }

  giggle() {
    this.x += random(-width * 0.005, width * 0.005); // Horizontal movement proportional to width
    this.y += random(-height * 0.005, height * 0.005); // Vertical movement proportional to height
    this.textSize += random(-width * 0.02, width * 0.02); // Size change proportional to width
  }

  display() {
    textSize(this.textSize);
    text(this.letter, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let i = 0; i < wigglyLetter.length; i++) {
    wigglyLetter[i].textSize = width * 0.03; // Adjust size based on new window size
  }
}
