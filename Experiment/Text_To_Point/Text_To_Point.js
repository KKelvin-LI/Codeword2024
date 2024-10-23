let pts;
let garamond;

function preload() {
  garamond = loadFont('data/AdobeClean-ExtraBold.otf'); // Load your font
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Center the text "CODEWORDS" in the middle of the canvas
  let bounds = garamond.textBounds('CODEWORDS', 0, 0, width / 10);
  let x = (width - bounds.w) / 2; // Calculate the x position to center the text
  let y = (height + bounds.h) / 2; // Calculate the y position to center the text

  // Create points for the text "CODEWORDS" at the center
  pts = garamond.textToPoints('CODEWORDS', x, y, width / 10, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });
}

function draw() {
  background(220); // Set background color

  let speedFactor = map(dist(mouseX, mouseY, width / 2, height / 2), 0, width / 2, 15, 5);
  
  stroke(0); // Set line color to black
  for (let i = 0; i < pts.length; i++) {
    let d = dist(mouseX, mouseY, pts[i].x, pts[i].y); // Calculate distance between mouse and each point
    
    // Calculate the randomness of the spikes based on the distance to the mouse
    let offset = map(d, 0, 300, 20, 5); // The closer the mouse, the larger the offset

    // Draw the spiky lines from each point with more randomness if mouse is close
    line(pts[i].x, pts[i].y, pts[i].x + random(-offset, offset), pts[i].y + random(-offset, offset));
  }
}
