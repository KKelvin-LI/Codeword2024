var song;
function preload(){
  song=loadSound("data/DDLG.mp3");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  background(0);
  getAudioContext().suspend();

}


function draw() {
  background(0,255,255);
  let circleDiameter= map(mouseY,0,height/2,1,400);
   circle(mouseX, mouseY,circleDiameter);
  let volume= map(mouseX, 0, width, 0.0, 1.0);
  let speed= map(mouseY, 0, height, 0.5, 5);
  song.amp(volume);
  song.rate(speed);
}

function mousePressed (){
  if (getAudioContext().state !== 'running') 
    getAudioContext().resume();
    song.play();
    song.loop();

}
function keyTyped(){
  if (key === " "){
  song.stop();
}
 else {
   song.play();
 }
}
