function setup() {
  createCanvas(400, 400);
  background(255);
  stroke(34, 139, 34);
  strokeWeight(2);
  noFill();

  translate(150, 350);

  beginShape();
  for (let a = 0; a < 8; a += 0.05) {
    let r = 5 + a * 8;
    let x = r * cos(a + PI);
    let y = -r * sin(a + PI);
    vertex(x, y);
  }
  endShape();
}
