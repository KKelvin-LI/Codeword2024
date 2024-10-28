let pts;
let AdobeClean;

function preload() {
  AdobeClean = loadFont('data/AdobeClean-ExtraBold.otf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let fontSize = width / 8; 
  let bounds = AdobeClean.textBounds('CODEWORDS', 0, 0, fontSize);
  let x = (width - bounds.w) / 2; 
  let y = (height + bounds.h) / 2; 

  pts = AdobeClean.textToPoints('CODEWORDS', x, y, fontSize, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });
}

function draw() {
  background(220); 

  stroke(0); 
  strokeWeight(height*0.001); 

  for (let i = 0; i < pts.length; i++) {
    let d = dist(mouseX, mouseY, pts[i].x, pts[i].y); // Distance between mouse and each point
    let offset = map(d, 0, 300, 20, 5); // Adjust the offset based on distance to the mouse

    // Calculate random offsets in both x and y directions
    let xOffset = random(-offset, offset);
    let yOffset = random(-offset, offset);

    // Draw the line with movement in both x and y directions
    line(pts[i].x, pts[i].y, pts[i].x + xOffset, pts[i].y + yOffset);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}