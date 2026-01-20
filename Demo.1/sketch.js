let size = 30;
let cols = 35;
let rows = 50;

let color_speed=0.3;

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
      fill((d * color_speed) % 255, 200 - ((d * color_speed)% 100), 100);
      stroke(255 - ((d * color_speed) % 255), 200, (d * color_speed) % 200);
      strokeWeight(6);
      rect(0, 0, size - 4, size - 4);
      pop();
    }
  }
}

function touchMoved() {
  return false;
}
