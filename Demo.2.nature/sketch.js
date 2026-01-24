function setup() {
  createCanvas(900, 900);
  segmentSize = 0.1;
  insideDiameter = 0;
  

}

function draw() {
  background(255);
  stroke(34, 139, 34);
  strokeWeight(2);
  noFill();

  translate(150, 350);

  // let end = map(mouseY, 0, height, 0, 8);
  let end = 0;
  let scale2 = map(mouseX, 0, width, 0.5, 30);

  beginShape();
  for (let a = 8; a > end; a -= segmentSize) {
    let r = insideDiameter+a*scale2;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape();
}
