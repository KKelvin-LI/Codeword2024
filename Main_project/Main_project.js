let p;
let dragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  p = new Pendulum(createVector(width / 2, 0), windowHeight / 2.2);  // Create a new Pendulum
}
  
function draw() {
  fill(255);
    noStroke();
  ellipse(mouseX, mouseY, windowWidth/4);
  p.go();
    
}

function Pendulum(origin_, r_) {
  this.origin = origin_.copy();  // Copy the origin vector to ensure it's not modified elsewhere
  this.position = createVector();
  this.r = r_;
  this.angle = 0;  // Start with the pendulum hanging down
  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.damping = 0.999;  // Damping factor to simulate air resistance/energy loss
  this.ballr = 50.0;  // Radius of the pendulum bob

  this.go = function() {
    if (!dragging) {
      this.update();  // Update pendulum physics only if not dragging
    }
    this.display();  // Always display the pendulum
  };

  this.update = function() {
    let gravity = 0.8;  // Gravity effect
    this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);  // Calculate the angular acceleration
    this.aVelocity += this.aAcceleration;  // Update the angular velocity
    this.aVelocity *= this.damping;  // Apply damping
    this.angle += this.aVelocity;  // Update the angle
  };

  this.display = function() {
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
    this.position.add(this.origin);  // Make sure the position is relative to the pendulum's origin
    
    stroke(0);
    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);  // Draw the pendulum arm
    ellipseMode(CENTER);
    fill(0);
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);  // Draw the pendulum bob
  };
}

function mousePressed() {
  let d = dist(mouseX, mouseY, p.position.x, p.position.y);
  if (d < p.ballr) {
    dragging = true;  // Start dragging if mouse is close enough to the bob
  }
}

function mouseDragged() {
  if (dragging) {
    let diff = createVector(mouseX - p.origin.x, mouseY - p.origin.y);
    p.angle = atan2(-diff.y, diff.x) + HALF_PI;  // Set the pendulum angle based on mouse position
  }
}

function mouseReleased() {
  dragging = false;  // Stop dragging
  let diff = createVector(mouseX - p.origin.x, mouseY - p.origin.y);
  let releaseAngle = atan2(-diff.y, diff.x) + HALF_PI;
  
  // Calculate the pendulum's position at the release angle
  let releaseX = p.r * sin(releaseAngle) + p.origin.x;
  
  // Define the stopping window as ±2% of the windowWidth around the pendulum's initial vertical position
  let stopWindowMin = p.origin.x - windowWidth * 0.02;
  let stopWindowMax = p.origin.x + windowWidth * 0.02;

  // Check if the pendulum's x-coordinate at release is within the stopping window
  if (releaseX > stopWindowMin && releaseX < stopWindowMax) {
    p.aVelocity = 0;  // Stop the pendulum by setting angular velocity to zero
  }
}
