let size = 60;
let cols = 15;
let rows = 25;

let color_speed = 0.7;

function setup() {
  createCanvas(cols * size, rows * size);
  colorMode(HSL, 360, 100, 100);
  rectMode(CENTER);
}

function draw() {
  background(0, 0, 100);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      let d = dist(x, y, mouseX, mouseY);
      let angle = d * 0.015;

      push();
      translate(x, y);
      rotate(angle);
      fill((d * color_speed) % 360, 100 - d / 10, 60);
      stroke((d * color_speed + 90) % 360, 100 - d / 3, 100);
      strokeWeight(d * d * 0.0001);
      rect(0, 0, size - 4, size - 4);
      pop();
    }
  }
}

function touchMoved() {
  return false;
}
