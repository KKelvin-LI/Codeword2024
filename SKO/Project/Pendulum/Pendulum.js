let pendulums = [];
let isRunning = true;
let brushLayer; 
let customFont, customFont2; 

const G = 1.2; 
const M = 1.0; 
const L = 1.0; 
const dtMax = 30.0; 
const tailMax = 2;
const barWidth = 0.02;
const barLength = 0.23;
const massRadius = 0.065;
const tailThickness = 0.012;
const arcSpacing = 3; 

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
  customFont = loadFont('data/PPSupplyMono-Ultralight.otf');
  customFont2 = loadFont('data/NotoSansSC-Light.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  brushLayer = createGraphics(windowWidth, windowHeight);
  brushLayer.background(242,242,242); 
  originX = windowWidth / 2;
  originY = windowHeight / 2;
  z = Math.min(windowWidth, windowHeight); 
  d = z * barLength;

  colorMode(RGB, 255); 

  brushLayer.textFont(customFont);
  textFont(customFont);

  pendulums.push(new Pendulum(true)); 
  frameRate(24);
}

function draw() {
  clear();

  image(brushLayer, 0, 0);

  if (isRunning) {
    pendulums.forEach(p => {
      p.step(30.0 / 1000.0); 
      p.updateTrail(); 
      p.displayTrail(); 
    });
  }

  pendulums.forEach(p => {
    p.drawPendulum(); 
  });
}

function mousePressed() {
  let color = generateFuturisticColor();
  pendulums.push(new Pendulum(false, color)); 
}

function keyPressed() {
  if (key === 'a') {
    let color = generateFuturisticColor();
    pendulums.push(new Pendulum(false, color)); 
  } else if (key === 'd') {
    if (pendulums.length > 0) {
      pendulums.pop();
    }
  } else if (key === ' ') {
    isRunning = !isRunning;
  }
}

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
  
  this.textColor = isFirstPendulum ? [0, 0, 0] : generateFuturisticColor(); 
  
  this.massColor = this.textColor; 

  this.sentence = isFirstPendulum ? englishSentence : random(randomSentences);
  this.fontSize = isFirstPendulum ? windowHeight / 40 : int(random(height / 50, height / 20)); 

  this.history = []; 

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
    fill(this.massColor); 
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

       brushLayer.fill(this.textColor); 
      textSize(this.fontSize);
      textAlign(CENTER);
      noStroke();
      brushLayer.textSize(this.fontSize);

      let currentChar = this.sentence.charAt(charIndex % this.sentence.length);
      if (isChinese(currentChar)) {
        brushLayer.textFont(customFont2); 
      } else {
        brushLayer.textFont(customFont); 
      }

      let angleOffset = atan2(this.history[i][3] - originY, this.history[i][2] - originX); 
      brushLayer.push(); 
      brushLayer.translate(this.history[i][2], this.history[i][3]);
      brushLayer.rotate(angleOffset + HALF_PI); 
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

function isChinese(char) {
  return /[\u3400-\u9FBF]/.test(char);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  
}