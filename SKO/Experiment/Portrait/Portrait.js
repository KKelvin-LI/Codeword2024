let mouth = 100;
let nostril = 20;
let edge = 40;
let brushLayer;  // Buffer for brush strokes

function setup() {
  createCanvas(windowWidth, windowHeight);
  brushLayer = createGraphics(windowWidth, windowHeight); // Off-screen graphics buffer
  brushLayer.clear(); // Ensure it starts with a transparent background
  frameRate(120);
}

function draw() {
  // Draw dynamic background that changes with mouse position
  background(255 - mouseX / 6, 255 - mouseY / 6, 255 - mouseY / 6);

  // Draw face elements
  noStroke();
  fill(255, 195, 170);
  ellipse(width / 2, height / 2, width / 3.2, height / 1.5);

  fill(255, 255, 255);
  ellipse(width / 2.35, height / 2.3, width / 15, height / 16);

  fill(255, 255, 255);
  ellipse(width / 1.75, height / 2.3, width / 15, height / 16);

  fill(255 - mouseX / 6, 255 - mouseY / 6, 255 - mouseY / 6);
  circle(width / 1.75, height / 2.3, height / 16);

  fill(255 - mouseX / 6, 255 - mouseY / 6, 255 - mouseY / 6);
  circle(width / 2.35, height / 2.3, height / 16);

  ellipse(width / 2, height / 1.4, mouth, mouth / 2);
  mouth += sin(frameCount * 0.03);

  circle(width / 1.95, height / 1.75, nostril);
  circle(width / 2.05, height / 1.75, nostril);
  nostril += sin(frameCount * 0.03) / 5;

  strokeWeight(1);
  stroke(0);
  noFill();
  arc(width / 2.08, height / 1.75, edge, edge, PI / 1.7, 7 * PI / 6);
  edge += sin(frameCount * 0.03) / 4;

  strokeWeight(1);
  stroke(0);
  noFill();
  arc(width / 1.92, height / 1.75, edge, edge, -PI / 4, PI / 2.3);

  // Show the brush strokes stored in the off-screen buffer
  image(brushLayer, 0, 0);

  // Brush that follows the mouse and stays on the canvas
  if (mouseIsPressed) {
    brushLayer.fill(255);  // Brush fill color (white)
    brushLayer.noStroke();  // Brush stroke color (black)
    brushLayer.ellipse(mouseX, mouseY, width/20);  // Draw the brush circle with a radius of 30
  }
}
