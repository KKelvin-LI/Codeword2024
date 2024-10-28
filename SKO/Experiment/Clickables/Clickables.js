var pic_1, pic_2, pic_3; // Variables to hold the images
let buttons = [];
var myRadio;

function preload() {
  pic_1 = loadImage("data/image_1.jpeg"); 
  pic_2 = loadImage("data/image_2.jpeg"); 
  pic_3 = loadImage("data/image_3.jpeg"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER); // Set imageMode to CENTER

  // Spawn 100 buttons with positions and sizes proportional to canvas dimensions
  for (let i = 0; i < 100; i++) {
    let btn = createButton('click me');
    btn.position(random(width * 0.05, width * 0.95), random(height * 0.05, height * 0.95)); // Position buttons within canvas bounds
    btn.style('font-size', `${width * 0.008}px`); // Font size proportional to width
    btn.style('padding', `${height * 0.005}px ${width * 0.01}px`); // Padding proportional to canvas size
    btn.mousePressed(() => removeButton(btn)); // Attach event listener to remove button when clicked
    buttons.push(btn); // Add button to array
  }

  // Create radio buttons to choose which image to display
  myRadio = createRadio();
  myRadio.style('font-size', `${width * 0.015}px`); // Set the font size of the radio buttons to be proportional

  // Add options to select images
  myRadio.option('pic_1', 'Image 1');
  myRadio.option('pic_2', 'Image 2');
  myRadio.option('pic_3', 'Image 3');

  // Set a default selected option
  myRadio.selected('pic_1');

  // Place the radio buttons at the middle of the canvas
  myRadio.position(width * 0.5 - width * 0.075, height * 0.5 - height * 0.025);
  myRadio.size(width * 0.15, height * 0.05); // Size proportional to the canvas
}

function draw() {
  background("blue"); // Clear the background in every frame

  // Set proportional stroke weight
  strokeWeight(width * 0.002); // Stroke weight proportional to canvas width
  stroke(255); // Set stroke color to white

  // Get the current selected radio button value
  let selectedImage = myRadio.value();

  // Display the selected image based on the radio button choice, adjusted to fill canvas while keeping aspect ratio
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

// Function to remove the clicked button
function removeButton(button) {
  button.remove(); // Remove the button from the screen
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reposition and resize elements on window resize
  for (let btn of buttons) {
    btn.position(random(width * 0.05, width * 0.95), random(height * 0.05, height * 0.95));
    btn.style('font-size', `${width * 0.008}px`); // Adjust font size on resize
    btn.style('padding', `${height * 0.005}px ${width * 0.01}px`); // Adjust padding on resize
  }
  
  myRadio.size(width * 0.15, height * 0.05); // Resize the radio button container
  myRadio.position(width * 0.5 - width * 0.075, height * 0.5 - height * 0.025); // Center on resize
}
