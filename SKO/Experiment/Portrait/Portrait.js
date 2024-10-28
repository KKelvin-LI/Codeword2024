let mouth = 100;
let nostril = 5;
let edge = 10;
let brushLayer;  // Buffer for brush strokes

function setup() {
  createCanvas(windowWidth, windowHeight);
  brushLayer = createGraphics(windowWidth, windowHeight); // Off-screen graphics buffer
  brushLayer.clear(); // Ensure it starts with a transparent background
  frameRate(120);
}

function draw() {
  // Draw dynamic background that changes with mouse position
  background(255 - mouseX / width * 255, 255 - mouseY / height * 255, 255 - mouseY / height * 255);

  // Draw face elements
  noStroke();
  fill(255, 195, 170);
  ellipse(width / 2, height / 2, width / 3.2, height / 1.5);  // Face

  fill(255, 255, 255);
  ellipse(width / 2.35, height / 2.3, width / 15, height / 16);  // Left eye
  ellipse(width / 1.75, height / 2.3, width / 15, height / 16);  // Right eye

  fill(255 - mouseX / width * 255, 255 - mouseY / height * 255, 255 - mouseY / height * 255);
  circle(width / 1.75, height / 2.3, height / 16);  // Right pupil
  circle(width / 2.35, height / 2.3, height / 16);  // Left pupil

  // Mouth
  ellipse(width / 2, height / 1.4, width / 10, height / 30);
  mouth += sin(frameCount * 0.03) / 2;

  // Nostrils
  circle(width / 1.95, height / 1.75, width / 150);  // Left nostril
  circle(width / 2.05, height / 1.75, width / 150);  // Right nostril
  nostril += sin(frameCount * 0.03) / 5;

  // Nose lines
  strokeWeight(width / 800);
  stroke(0);
  noFill();
  arc(width / 2.08, height / 1.75, width / 30, height / 30, PI / 1.7, 7 * PI / 6);
  edge += sin(frameCount * 0.03) / 4;

  arc(width / 1.92, height / 1.75, width / 30, height / 30, -PI / 4, PI / 2.3);

  // Show the brush strokes stored in the off-screen buffer
  image(brushLayer, 0, 0);

  // Brush that follows the mouse and stays on the canvas
  if (mouseIsPressed) {
    brushLayer.fill(255);  // Brush fill color (white)
    brushLayer.noStroke();
    brushLayer.ellipse(mouseX, mouseY, width / 20);  // Brush circle size proportional to width
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  brushLayer = createGraphics(windowWidth, windowHeight);  // Adjust brush layer to new size
  brushLayer.clear();
}
