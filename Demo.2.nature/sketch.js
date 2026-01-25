let curlInstances = [];

function setup() {
  createCanvas(900, 900);
  let segmentSize = 0.1;
  let insideDiameter = 5;
  let strokeMax = 7;

  curlInstances.push(new Curl(width * 0.5, height * 0.4, insideDiameter, segmentSize, strokeMax, PI * 8));
  curlInstances.push(new Curl(width * 0.5, height * 0.4, insideDiameter, segmentSize, strokeMax, PI * 9));
}

class Curl {
  constructor(x, y, insideDiameter, segmentSize, strokeMax, curls) {
    this.x = x;
    this.y = y;
    this.insideDiameter = insideDiameter;
    this.segmentSize = segmentSize;
    this.strokeMax = strokeMax;
    this.curls = curls;
  }

  draw(scale2) {
    let end = 0;
    let curlsAdjusted = this.curls;

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

  let scale2 = map(mouseY, 0, height, 0.5, 30);

  showVars({
    curls: inst => inst.curls,
    scale2,
  });

  for (let curl of curlInstances) {
    curl.draw(scale2);
  }
}

function showVars(vars, instances = curlInstances) {
  push();
  fill(0);
  noStroke();
  textSize(18);
  let y = 20;
  for (let [name, value] of Object.entries(vars)) {
    let values;
    if (Array.isArray(value)) {
      values = value;
    } else if (typeof value === 'function') {
      values = instances.map((inst, idx) => value(inst, idx));
    } else {
      values = instances.map(() => value);
    }
    let formatted = values.map(v => (typeof v === 'number' ? v.toFixed(2) : v));
    text(name + " [" + formatted.join(",") + "]", 10, y);
    y += 20;
  }
  pop();
}
