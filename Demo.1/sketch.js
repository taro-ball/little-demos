let size = 60;
let cols = 15;
let rows = 25;

let color_speed = 0.7;

let puck;

class Puck {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let speed = 0.0002; // per millisecond
    this.x += dx * speed * deltaTime;
    this.y += dy * speed * deltaTime;
  }
}

function setup() {
  createCanvas(cols * size, rows * size);
  colorMode(HSL, 360, 100, 100);
  rectMode(CENTER);
  puck = new Puck(width / 2, height / 2);
}

function draw() {
  background(0, 0, 100);

  puck.update(mouseX, mouseY);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      let d = dist(x, y, puck.x, puck.y);
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
