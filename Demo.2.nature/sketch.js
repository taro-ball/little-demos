function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  stroke(34, 139, 34);
  strokeWeight(2);
  noFill();

  translate(150, 350);

  let end = map(mouseY, 0, height, 0, 8);

  beginShape();
  for (let a = 8; a > end; a -= 0.05) {
    let r = 5 + a * 8;
    let x = r * cos(a + PI);
    let y = -r * sin(a + PI);
    vertex(x, y);
  }
  endShape();
}
