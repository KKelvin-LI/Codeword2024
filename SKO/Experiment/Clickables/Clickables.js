var pic_1, pic_2, pic_3; // Variables to hold the images
let buttons = [];
var myRadio;

function preload() {
  pic_1 = loadImage("./data/image_1.jpeg"); 
  pic_2 = loadImage("./data/image_2.jpeg"); 
  pic_3 = loadImage("./data/image_3.jpeg"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (let i = 0; i < 100; i++) {
    let btn = createButton('click me');
    btn.position(random(width * 0.05, width * 0.95), random(height * 0.05, height * 0.95));
    btn.style('font-size', `${width * 0.008}px`);
    btn.style('padding', `${height * 0.005}px ${width * 0.01}px`);
    btn.mousePressed(() => removeButton(btn));
    buttons.push(btn);
  }

  myRadio = createRadio();
  myRadio.option('pic_1', 'Image 1');
  myRadio.option('pic_2', 'Image 2');
  myRadio.option('pic_3', 'Image 3');
  myRadio.selected('pic_1');

  // Add the CSS class for styling
  myRadio.addClass('radio-style');

  myRadio.position(width * 0.5 - width * 0.075, height * 0.1);
}

function draw() {
  background("blue");

  strokeWeight(width * 0.002);
  stroke(255);

  let selectedImage = myRadio.value();
  let imgAspect = pic_1.width / pic_1.height;
  let canvasAspect = width / height;
  let imgWidth, imgHeight;

  if (canvasAspect > imgAspect) {
    imgWidth = width;
    imgHeight = width / imgAspect;
  } else {
    imgHeight = height;
    imgWidth = height * imgAspect;
  }

  if (selectedImage === 'pic_1') {
    image(pic_1, width / 2, height / 2, imgWidth, imgHeight);
  } else if (selectedImage === 'pic_2') {
    image(pic_2, width / 2, height / 2, imgWidth, imgHeight);
  } else if (selectedImage === 'pic_3') {
    image(pic_3, width / 2, height / 2, imgWidth, imgHeight);
  }
}

function removeButton(button) {
  button.remove();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  for (let btn of buttons) {
    btn.position(random(width * 0.05, width * 0.95), random(height * 0.05, height * 0.95));
    btn.style('font-size', `${width * 0.008}px`);
    btn.style('padding', `${height * 0.005}px ${width * 0.01}px`);
  }

  // Reposition the radio button on resize
  myRadio.position(width * 0.5 - width * 0.075, height * 0.1);
}
