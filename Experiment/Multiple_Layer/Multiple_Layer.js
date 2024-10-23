let p, r; // Two graphics canvases
let img;  // Variable to hold the image

function preload() {
  img = loadImage("data/Colour.jpeg"); // Replace with your image path
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create the two layers
  p = createGraphics(width, height); // This is the top layer
  r = createGraphics(width, height); // This is the image layer
  
  p.background(0); // Black background for the top layer
  r.imageMode(CENTER); // Center the image on the bottom layer
  
  // Draw the image onto the bottom layer
  r.image(img, width / 2, height / 2, windowWidth, windowHeight); // Fill canvas with the image
  
  frameRate(120); // Set frame rate
}

function draw() {
  // Draw the two layers
  image(r, 0, 0); // Draw the image layer
  image(p, 0, 0); // Draw the top layer
  
  // Erase part of the top layer (p) where the circle is
  p.erase();
  p.circle(mouseX, mouseY, 30); // Draw an erasing circle at the mouse position
}
