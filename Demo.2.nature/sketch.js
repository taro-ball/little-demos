function setup() {
  createCanvas(900, 900);
  segmentSize = 0.1;
  insideDiameter = 5;
  

}

function draw() {
  background(255);
  stroke(34, 139, 34);
  strokeWeight(2);
  noFill();

  // let end = map(mouseY, 0, height, 0, 8);
  let end = 0;
  let scale2 = map(mouseX, 0, width, 0.5, 30);

  // Calculate tail position (at a=8) and translate so it stays fixed
  let tailA = 8;
  let tailR = insideDiameter + tailA * scale2;
  let tailX = tailR * cos(tailA);
  let tailY = tailR * sin(tailA);

  translate(150 - tailX, 350 - tailY);

  beginShape();
  for (let a = 8; a > end; a -= segmentSize) {
    let r = insideDiameter+a*scale2;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape();
}
