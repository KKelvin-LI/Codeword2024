//code references zygugi and chatgbt
let p;
let dragging = false;
let path = []; // Array to store the positions of the pendulum bob
let brushLayer; // Graphics buffer for the paint brush effect
let textContent = "unstable media are characterized by dynamic motion and changeability";
let textIndex = 0;
let arcSpacing = 3; // Control spacing between characters based on arc length distance
let prevArcLength = 0; // Store previous arc length to calculate spacing
let leftReached = false; // Track if leftmost point has been reached
let rightReached = false; // Track if rightmost point has been reached

function setup() {
  createCanvas(windowWidth, windowHeight);
  p = new Pendulum(createVector(width / 2, 0), windowHeight / 2.2); // Create a new Pendulum

  // Create a separate graphics buffer for the brush effect
  brushLayer = createGraphics(windowWidth, windowHeight);
  brushLayer.background(255); // Set the initial background to white
}

function draw() {
  // Display the brush layer with all the previously drawn text
  image(brushLayer, 0, 0);

  // Draw a circle following the mouse as a visual indicator
  if (mouseIsPressed) {
    brushLayer.push();
    brushLayer.fill(255);
    //fill(255);
    brushLayer.noStroke();
    brushLayer.ellipse(mouseX, mouseY, windowWidth / 8);
  }
    // Draw the pendulum
  p.go(); // Update and display the pendulum
}

function Pendulum(origin, r_) {
  this.origin = origin.copy(); // Copy the origin vector to ensure it's not modified elsewhere
  this.position = createVector();
  this.r = r_;
  this.angle = 0; // Start with the pendulum at the center
  this.aVelocity = 0.0; // No initial velocity
  this.aAcceleration = 0.0;
  this.damping = 0.999; // Damping factor to simulate air resistance/energy loss
  this.ballr = windowHeight / 15; // Radius of the pendulum bob
  this.isSwinging = false; // Flag to determine if the pendulum is swinging
  this.returningToCenter = false; // Flag to indicate returning to center

  this.go = function() {
    if (!dragging && (this.isSwinging || this.returningToCenter)) {
      this.update(); // Update pendulum physics only if not dragging and swinging or returning to center
    }
    this.display(); // Always display the pendulum
  };

  this.update = function() {
    let gravity = 0.6; // Gravity effect
    if (this.returningToCenter) {
      // If returning to center, move smoothly to center
      this.angle += (0 - this.angle) * 0.1; // Smoothly move the angle to zero
      this.aVelocity *= 0.8; // Reduce velocity gradually
      if (abs(this.angle) < 0.01 && abs(this.aVelocity) < 0.01) {
        this.aVelocity = 0; // Stop the pendulum
        this.angle = 0; // Set the angle to zero
        this.returningToCenter = false; // Stop returning to center
        this.isSwinging = false; // Stop swinging
      }
    } else {
      // Normal pendulum update
      this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle); // Calculate the angular acceleration
      this.aVelocity += this.aAcceleration; // Update the angular velocity
      this.aVelocity *= this.damping; // Apply damping
      this.angle += this.aVelocity; // Update the angle
    }

    // Check if pendulum has reached the leftmost or rightmost positions
    if (this.angle > 0.1) {
      rightReached = true; // Reached the rightmost position
    }
    if (this.angle < -0.1) {
      leftReached = true; // Reached the leftmost position
    }

    // Check for reset condition: after reaching both extremes, when pendulum passes center
    if (this.angle > -0.01 && this.angle < 0.01 && leftReached && rightReached) {
      leftReached = false; // Reset left flag
      rightReached = false; // Reset right flag
    }

    // Calculate current arc length along the pendulum's path
    let currentArcLength = abs(this.angle) * this.r;

    // Add current position and character to the brushLayer based on arc length
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
    this.position.add(this.origin); // Make sure the position is relative to the pendulum's origin

    // Check if the arc length difference is greater than arcSpacing
    if (abs(currentArcLength - prevArcLength) >= arcSpacing) {
      let angleOffset = atan2(this.position.y - this.origin.y, this.position.x - this.origin.x);
      brushLayer.push();
      brushLayer.translate(this.position.x, this.position.y);
      brushLayer.rotate(angleOffset - HALF_PI);
      brushLayer.textSize(width/85);
      brushLayer.fill(0);
      brushLayer.noStroke();
      brushLayer.text(textContent.charAt(textIndex % textContent.length), 0, 0);
      brushLayer.pop();

      textIndex++; // Increment to the next character
      prevArcLength = currentArcLength; // Update previous arc length
    }
  };

  this.display = function() {
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
    this.position.add(this.origin); // Make sure the position is relative to the pendulum's origin

    // Draw the pendulum arm
    stroke(0);
    strokeWeight(windowWidth / 600);
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);

    // Draw the pendulum bob
    fill(0);
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
  };
}

function resetTextPositions() {
  textIndex = 0; // Reset text index
  prevArcLength = 0; // Reset arc length to zero
}

function mousePressed() {
  let d = dist(mouseX, mouseY, p.position.x, p.position.y);
  if (d < p.ballr) {
    dragging = true; // Start dragging if mouse is close enough to the bob
    resetTextPositions(); // Reset text and path positions
    p.isSwinging = false; // Stop the pendulum motion while dragging
    p.returningToCenter = false; // Stop returning to center
  }
}

function mouseDragged() {
  if (dragging) {
    let diff = createVector(mouseX - p.origin.x, mouseY - p.origin.y);
    p.angle = atan2(-diff.y, diff.x) + HALF_PI; // Set the pendulum angle based on mouse position
  }
}

function mouseReleased() {
  dragging = false; // Stop dragging
  let diff = createVector(mouseX - p.origin.x, mouseY - p.origin.y);
  let releaseAngle = atan2(-diff.y, diff.x) + HALF_PI;

  // Calculate the pendulum's position at the release angle
  let releaseX = p.r * sin(releaseAngle) + p.origin.x;

  // Define the range around the center
  let centerRangeMin = p.origin.x - windowWidth * 0.02;
  let centerRangeMax = p.origin.x + windowWidth * 0.02;

  // Check if the pendulum's x-coordinate at release is within the range near the center
  if (releaseX > centerRangeMin && releaseX < centerRangeMax) {
    p.returningToCenter = true; // Set the pendulum to return to center
  } else {
    p.isSwinging = true; // Set the pendulum to swing normally
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
// draw word instead of letters 
// html text direction to left to right
// when the word finishe in currently swing, it stops generating until it hits its leftmost or right,ost that it will start another swing
