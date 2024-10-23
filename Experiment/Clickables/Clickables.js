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
  background("blue");
  imageMode(CENTER); // Set imageMode to CENTER
  
  // Spawn 100 buttons
  for (let i = 0; i < 100; i++) {
    let btn = createButton('click me');
    btn.position(random(width), random(height)); // Position buttons randomly
    btn.mousePressed(() => removeButton(btn)); // Attach event listener to remove button when clicked
    buttons.push(btn); // Add button to array
  }

  // Create radio buttons to choose which image to display
  myRadio = createRadio();
  myRadio.size(500); // Set the size of the radio buttons (five times larger)

  // Add options to select images, but use "Image 1", "Image 2", "Image 3" for display
  myRadio.option('pic_1', 'Image 1');
  myRadio.option('pic_2', 'Image 2');
  myRadio.option('pic_3', 'Image 3');

  // Set a default selected option
  myRadio.selected('pic_1');

  // Set the text size for the radio buttons to be larger
  myRadio.style('font-size', 'height/20'); // Five times larger font

  // Place the radio buttons at the middle of the canvas
  myRadio.position(width / 2 - myRadio.width / 2, height / 2 - myRadio.height / 2);
}

function draw() {
  background("blue"); // Clear the background in every frame

  // Get the current selected radio button value
  let selectedImage = myRadio.value();

  // Display the selected image based on the radio button choice
  if (selectedImage === 'pic_1') {
    image(pic_1, width / 2, height / 2, windowWidth, windowHeight);
  } else if (selectedImage === 'pic_2') {
    image(pic_2, width / 2, height / 2, windowWidth, windowHeight);
  } else if (selectedImage === 'pic_3') {
    image(pic_3, width / 2, height / 2, windowWidth, windowHeight);
  }
}

// Function to remove the clicked button
function removeButton(button) {
  button.remove(); // Remove the button from the screen
}
