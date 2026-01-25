let fernInstances = [];

function setup() {
  createCanvas(900, 900);
  let segmentSize = 0.1;
  let insideDiameter = 5;
  let strokeMax = 7;

  fernInstances.push(new Fern(width * 0.5, height * 0.4, 4, insideDiameter, segmentSize, strokeMax, PI * 2));
}

class Fern {
  constructor(x, y, frondCount, insideDiameter, segmentSize, strokeMax, baseCurls) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.fronds = [];

    let spacing = TWO_PI / frondCount;
    for (let i = 0; i < frondCount; i++) {
      let curls = baseCurls + i * spacing;
      this.fronds.push(new Frond(x, y, insideDiameter, segmentSize, strokeMax, curls));
    }
  }

  update(mx, my) {
    let ax = (mx - this.x) * 0.02;
    let ay = (my - this.y) * 0.02;
    this.dx = (this.dx + ax) * 0.9;
    this.dy = (this.dy + ay) * 0.9;
    this.x += this.dx;
    this.y += this.dy;

    for (let frond of this.fronds) {
      frond.x = this.x;
      frond.y = this.y;
    }
  }

  draw(scale2, mx, my, maxDist) {
    for (let frond of this.fronds) {
      frond.draw(scale2, mx, my, maxDist);
    }
  }
}

class Frond {
  constructor(x, y, insideDiameter, segmentSize, strokeMax, curls) {
    this.x = x;
    this.y = y;
    this.insideDiameter = insideDiameter;
    this.segmentSize = segmentSize;
    this.strokeMax = strokeMax;
    this.curls = curls;
  }

  draw(scale2, mx, my, maxDist) {
    let end = 0;
    let distanceFromBase = dist(mx, my, this.x, this.y);
    let t = constrain(distanceFromBase / maxDist, 0, 1);
    let curlsAdjusted = lerp(this.curls * 1.5, this.curls * 0.5, t);

    let baseR = this.insideDiameter + curlsAdjusted * scale2;
    let baseX = baseR * cos(curlsAdjusted);
    let baseY = baseR * sin(curlsAdjusted);

    push();
    translate(this.x - baseX, this.y - baseY);
    noFill();
    stroke(34, 139, 34);

    let prevX, prevY;
    for (let a = curlsAdjusted; a > end; a -= this.segmentSize) {
      let r = this.insideDiameter + a * scale2;
      let x = r * cos(a);
      let y = r * sin(a);

      let sw = map(a, end, curlsAdjusted, 0, this.strokeMax);
      strokeWeight(sw);

      if (prevX !== undefined) {
        line(prevX, prevY, x, y);
      }
      prevX = x;
      prevY = y;
    }
    pop();
  }
}

function draw() {
  background(255);
  stroke(34, 139, 34);

  noFill();

  let scale2 = 4//map(mouseY, 0, height, 0.5, 30);
  let maxDist = min(width, height) * 0.75;


  for (let fern of fernInstances) {
    fern.update(mouseX, mouseY);
    fern.draw(scale2, mouseX, mouseY, maxDist);
  }
}

function getAllFronds(instances = fernInstances) {
  return instances.flatMap(fern => fern.fronds);
}
