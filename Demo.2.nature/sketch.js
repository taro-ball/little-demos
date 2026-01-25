let fernInstances = [];
const BUTTON_RECT = { x: 0, y: 0, w: 220, h: 55, r: 0 };

function setup() {
  createCanvas(800, 1200);
  colorMode(HSL, 360, 100, 100, 1);
  createRandomFern();
}

function createRandomFern() {
  let frondCount = floor(random(1, 6));
  let segmentSize = random(0.9, 2.2);
  let insideDiameter = (0,10);
  let strokeMax = random(4, 14);
  let hue = random(80, 160);
  let saturation = random(65, 100);
  let lightness = random(35, 75);
  let fernColorHSL = [hue, saturation, lightness];
  let baseCurls = random(3, 12);

  fernInstances = [
    new Fern(
      width * 0.5,
      height * 0.4,
      frondCount,
      insideDiameter,
      segmentSize,
      strokeMax,
      baseCurls,
      fernColorHSL,
      0
    )
  ];
}

class Fern {
  constructor(
    x,
    y,
    frondCount,
    insideDiameter,
    segmentSize,
    strokeMax,
    baseCurls,
    colorHSL,
    invertDependency = false
  ) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.fronds = [];
    this.invertDependency = invertDependency;
    this.colorHSL = colorHSL;

    let spacing = TWO_PI / frondCount;
    for (let i = 0; i < frondCount; i++) {
      let curls = baseCurls + i * spacing;
      this.fronds.push(
        new Frond(x, y, insideDiameter, segmentSize, strokeMax, curls, this.colorHSL, this.invertDependency)
      );
    }
  }

  update(mx, my) {
    // Scale motion to frame time (assuming 60fps baseline).
    let dt = min(deltaTime, 100) / 16.6667;
    let ax = (mx - this.x) * 0.02;
    let ay = (my - this.y) * 0.02;
    let damping = pow(0.9, dt);
    this.dx = (this.dx + ax * dt) * damping;
    this.dy = (this.dy + ay * dt) * damping;
    this.x += this.dx * dt;
    this.y += this.dy * dt;

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
  constructor(x, y, insideDiameter, segmentSize, strokeMax, curls, colorHSL, invertDependency = false) {
    this.x = x;
    this.y = y;
    this.insideDiameter = insideDiameter;
    this.segmentSize = segmentSize;
    this.strokeMax = strokeMax;
    this.curls = curls;
    this.invertDependency = invertDependency;
    this.colorHSL = colorHSL;
  }

  draw(scale2, mx, my, maxDist) {
    let end = 0;
    let distanceFromBase = dist(mx, my, this.x, this.y);
    let t = constrain(distanceFromBase / maxDist, 0, 1);
    let lerpT = this.invertDependency ? 1 - t : t;
    let curlsAdjusted = lerp(this.curls * 1.5, this.curls * 0.5, lerpT);

    let baseR = this.insideDiameter + curlsAdjusted * scale2;
    let baseX = baseR * cos(curlsAdjusted);
    let baseY = baseR * sin(curlsAdjusted);

    push();
    translate(this.x - baseX, this.y - baseY);
    noFill();
    if (this.colorHSL && this.colorHSL.length >= 3) {
      stroke(
        this.colorHSL[0],
        this.colorHSL[1],
        this.colorHSL[2],
        this.colorHSL.length > 3 ? this.colorHSL[3] : 1
      );
    }

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

  noFill();

  let scale2 = 4//map(mouseY, 0, height, 0.5, 30);
  let maxDist = min(width, height) * 0.75;


  for (let fern of fernInstances) {
    fern.update(mouseX, mouseY);
    fern.draw(scale2, mouseX, mouseY, maxDist);
  }

  drawFernButton();
}

function getAllFronds(instances = fernInstances) {
  return instances.flatMap(fern => fern.fronds);
}
let eyeArray="@#^*-+=07QQWTYUIO7AHXV<>~:x"
let mouthArray="-__wov<>,..!"
let buttonText = "-.-"
function drawFernButton() {
  let buttonColor = getCurrentFernColor();
  push();
  noStroke();
  if (buttonColor) {
    fill(
      buttonColor[0],
      buttonColor[1],
      buttonColor[2],
      buttonColor.length > 3 ? buttonColor[3] : 1
    );
  } 
  rect(BUTTON_RECT.x, BUTTON_RECT.y, BUTTON_RECT.w, BUTTON_RECT.h, BUTTON_RECT.r);

  let textLightness = buttonColor && buttonColor[2] > 60 ? 10 : 95;
  fill(0, 0, textLightness);
  textAlign(CENTER, CENTER);
  textSize(48);
  text(buttonText, BUTTON_RECT.x + BUTTON_RECT.w / 2, BUTTON_RECT.y + BUTTON_RECT.h / 2);
  pop();
}

function getCurrentFernColor() {
  if (fernInstances.length && fernInstances[0].colorHSL) {
    return fernInstances[0].colorHSL;
  }
  return null;
}

function mousePressed() {
  if (isOverButton(mouseX, mouseY)) {
    createRandomFern();
    buttonText = (e=eyeArray[floor(random(eyeArray.length))],e+mouthArray[floor(random(mouthArray.length))]+e);
  }
}

function isOverButton(mx, my) {
  return (
    mx >= BUTTON_RECT.x &&
    mx <= BUTTON_RECT.x + BUTTON_RECT.w &&
    my >= BUTTON_RECT.y &&
    my <= BUTTON_RECT.y + BUTTON_RECT.h
  );
}
