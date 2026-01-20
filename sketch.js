let size = 30;
let cols = 20;
let rows = 20;

function setup() {
  createCanvas(cols * size, rows * size);
  rectMode(CENTER);
}

function draw() {
  background(255);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      let d = dist(x, y, mouseX, mouseY);
      let angle = d * 0.01;

      push();
      translate(x, y);
      rotate(angle);
      fill(200);
      stroke(0);
      rect(0, 0, size - 4, size - 4);
      pop();
    }
  }
}
