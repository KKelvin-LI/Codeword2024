let pendulums = [];
let isRunning = true;
let brushLayer; 
let customFont, customFont2; 
// Initialize some basic parameters
const G = 1.2; // gravitational acceleration
const M = 1.0; // mass
const L = 1.0; // length
const dtMax = 30.0; // ms
const tailMax = 2; // tail length
const barWidth = 0.02;
const barLength = 0.23;
const massRadius = 0.065;
const tailThickness = 0.012;
const arcSpacing = 3; // Spacing between characters

// Sentence array
const englishSentence = "unstable media are characterized by dynamic motion and changeability";
const randomSentences = [
  "不稳定的媒介以动态和可变性为特征",
  "#@*&#@&##@*",
  "medias instables sont caractérisés par un mouvement dynamique et une variabilité",
];

let charIndex = 0;
let prevArcLength = 0;
let originX, originY, z, d;

function preload() {
  // Load the custom fonts
  customFont = loadFont('data/PPSupplyMono-Ultralight.otf');
  customFont2 = loadFont('data/NotoSansSC-Light.ttf'); // Chinese font
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a separate graphics buffer for the permanent text layer
  brushLayer = createGraphics(windowWidth, windowHeight);
  brushLayer.background(242,242,242); // Set initial background to white

  originX = windowWidth / 2;
  originY = windowHeight / 2;
  z = Math.min(windowWidth, windowHeight); // Scaling factor for the pendulum
  d = z * barLength;

  colorMode(RGB, 255); // Ensure everything is in RGB mode

  // Set the default font for non-Chinese text
  brushLayer.textFont(customFont);
  textFont(customFont);

  // Add the first pendulum (always black, with English sentence)
  pendulums.push(new Pendulum(true)); 
  frameRate(24);
}

function draw() {
  clear();

  // Display the brush layer with permanent text
  image(brushLayer, 0, 0);

  // Draw trails (including text) first
  if (isRunning) {
    pendulums.forEach(p => {
      p.step(30.0 / 1000.0); // Step the pendulum with a time delta (convert ms to s)
      p.updateTrail(); // Update the trail
      p.displayTrail(); // Draw the trail (on the brush layer)
    });
  }

  // Draw pendulums on top of the trails
  pendulums.forEach(p => {
    p.drawPendulum(); // Draw the pendulum parts (bobs, arms)
  });
}

function mousePressed() {
  let color = generateFuturisticColor();
  pendulums.push(new Pendulum(false, color)); // All other pendulums, with random color
}

function keyPressed() {
  if (key === 'a') {
    let color = generateFuturisticColor();
    pendulums.push(new Pendulum(false, color)); // Add pendulums with random color
  } else if (key === 'd') {
    if (pendulums.length > 0) {
      pendulums.pop(); // Remove the last pendulum
    }
  } else if (key === ' ') {
    isRunning = !isRunning;
  }
}

// Generate vibrant colors from a well-selected palette of 20 futuristic colors
function generateFuturisticColor() {
let vibrantColors = [
    [0, 47, 167], //Klein Blue    
    [0, 187, 239],  //SKy Blue  
    [56, 254, 0], // Vibrant green  
    [249, 220, 36],  //Senneier Yellow  
    [255, 88, 2],  //Neon Orange      
    [243, 7, 2],   //RGB red 
    [248, 0, 124], // Neon Pink
    [166, 20, 246],  //medium purple
    [62,125,70],
      ];

  // Randomly pick one of the 20 vibrant colors
  return random(vibrantColors);
}

function deriviative(a1, a2, p1, p2) {
  let ml2 = 1.0 * 1.0 * 1.0;
  let cos12 = cos(a1 - a2);
  let sin12 = sin(a1 - a2);
  let da1 = 6 / ml2 * (2 * p1 - 3 * cos12 * p2) / (16 - 9 * cos12 * cos12);
  let da2 = 6 / ml2 * (8 * p2 - 3 * cos12 * p1) / (16 - 9 * cos12 * cos12);
  let dp1 = ml2 / -2 * (+da1 * da2 * sin12 + 3 * G / L * sin(a1));
  let dp2 = ml2 / -2 * (-da1 * da2 * sin12 + 3 * G / L * sin(a2));
  return [da1, da2, dp1, dp2];
}

function rk4(a1, a2, p1, p2, dt) {
  let [da1, da2, dp1, dp2] = deriviative(a1, a2, p1, p2);

  let a1mid = a1 + da1 * dt / 2;
  let a2mid = a2 + da2 * dt / 2;
  let p1mid = p1 + dp1 * dt / 2;
  let p2mid = p2 + dp2 * dt / 2;

  let [da1mid, da2mid, dp1mid, dp2mid] = deriviative(a1mid, a2mid, p1mid, p2mid);

  let a1new = a1 + da1mid * dt;
  let a2new = a2 + da2mid * dt;
  let p1new = p1 + dp1mid * dt;
  let p2new = p2 + dp2mid * dt;

  return [a1new, a2new, p1new, p2new];
}

function Pendulum(isFirstPendulum, color) {
  this.isFirstPendulum = isFirstPendulum;
  this.tailColor = isFirstPendulum ? [0, 0, 0] : color || [random(255), random(255), random(255)];
  
  // Generate random text color for non-first pendulums (RGB mode)
  this.textColor = isFirstPendulum ? [0, 0, 0] : generateFuturisticColor(); // Use vibrant colors for text
  
  // Now use the same color for the bob (mass) and text color
  this.massColor = this.textColor; // Match the bob color with the text color

  this.sentence = isFirstPendulum ? englishSentence : random(randomSentences);
  this.fontSize = isFirstPendulum ? windowHeight / 40 : int(random(height / 50, height / 20)); // Correct font size for non-first

  this.history = []; // Array to store the positions of the pendulum bob over time

  this.a1 = Math.random() * Math.PI / 2 + Math.PI * 3 / 4;
  this.a2 = Math.random() * Math.PI / 2 + Math.PI * 3 / 4;
  this.p1 = 0.0;
  this.p2 = 0.0;

  this.step = function(dt) {
    let newState = rk4(this.a1, this.a2, this.p1, this.p2, dt);
    this.a1 = newState[0];
    this.a2 = newState[1];
    this.p1 = newState[2];
    this.p2 = newState[3];
  };

  this.drawPendulum = function() {
    let x = Math.sin(this.a1) * d;
    let y = -Math.cos(this.a1) * d;
    let x2 = x + Math.sin(this.a2) * d;
    let y2 = y - Math.cos(this.a2) * d;

    stroke(0);
    strokeWeight(windowHeight/4 * 0.01);
    fill(this.massColor); // Now the bob color will match the text color
    ellipse(width / 2, height / 2, z * massRadius / 2, z * massRadius / 2);
    ellipse(x + width / 2, y + height / 2, z * massRadius / 2, z * massRadius / 2);
    ellipse(x2 + width / 2, y2 + height / 2, z * massRadius / 2, z * massRadius / 2);

    stroke(0);
    strokeWeight(z * barWidth / 4);
    line(originX, originY, x + width / 2, y + height / 2);
    line(x + width / 2, y + height / 2, x2 + width / 2, y2 + height / 2);
  };

  this.displayTrail = function() {
    for (let i = 0; i < this.history.length - 1; i++) {
      stroke(this.tailColor[0], this.tailColor[1], this.tailColor[2], (1 - i / this.history.length) * 255);

      // Ensure we set the fill color on the brushLayer
      brushLayer.fill(this.textColor); // Ensure text uses random color
      textSize(this.fontSize);
      textAlign(CENTER);
      noStroke();
      brushLayer.textSize(this.fontSize);

      // Set font based on character type (Chinese or non-Chinese)
      let currentChar = this.sentence.charAt(charIndex % this.sentence.length);
      if (isChinese(currentChar)) {
        brushLayer.textFont(customFont2); // Chinese font
      } else {
        brushLayer.textFont(customFont); // Non-Chinese font
      }

      // Calculate angle so the text faces the origin
      let angleOffset = atan2(this.history[i][3] - originY, this.history[i][2] - originX); 
      brushLayer.push(); // Draw text on the brushLayer (permanent)
      brushLayer.translate(this.history[i][2], this.history[i][3]);
      brushLayer.rotate(angleOffset + HALF_PI); // Rotate text to always face the origin
      brushLayer.text(currentChar, 0, 0);
      brushLayer.pop();
      charIndex++;
    }
  };

  this.updateTrail = function() {
    let currentPos = this.positions();
    this.history.push(currentPos);
    if (this.history.length > tailMax) {
      this.history.shift();
    }
  };

  this.positions = function() {
    let x1 = originX + Math.sin(this.a1) * d;
    let y1 = originY - Math.cos(this.a1) * d;
    let x2 = x1 + Math.sin(this.a2) * d;
    let y2 = y1 - Math.cos(this.a2) * d;
    return [x1, y1, x2, y2];
  };

  this.color2style = function(color) {
    let r = Math.round(255 * color[0]);
    let g = Math.round(255 * color[1]);
    let b = Math.round(255 * color[2]);
    return [r, g, b];
  };

  this.clone = function(conf) {
    if (!conf) conf = {};
    let cp2;
    if (this.p2 === 0.0) cp2 = random() * 1e-12;
    else cp2 = this.p2 * (1 - random() * 1e-10);
    conf.init = [this.a1, this.a2, this.p1, cp2];
    conf.tailColor = this.tailColor;
    return new Pendulum(conf);
  };
}

// Helper function to check if a character is Chinese
function isChinese(char) {
  return /[\u3400-\u9FBF]/.test(char);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  
}
