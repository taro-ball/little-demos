let fernInstances = [];
let armFerns = [];
let BUTTON_RECT;
let currentFernConfig;
let headX = 0;
let headY = 0;
let headDX = 0;
let headDY = 0;
let headAngle = 0;
let headAngleVel = 0;
let maxFerns = 0;
let FrondFade = 18;

function setup() {
  createCanvas(980, 1500);
  colorMode(HSL, 360, 100, 100, 1);
  BUTTON_RECT = { x: (width - 220) / 2, y: 0, w: 180, h: 55, r: 0 };
  headX = width * 0.5;
  headY = BUTTON_RECT.y + BUTTON_RECT.h / 2;
  createRandomFern();
}

function createRandomFern() {
  let frondCount = floor(random(1, 6));
  let segmentSize = random(0.9, 2.2);
  let insideDiameter = random(0, 10);
  let strokeMax = random(4, 14);
  let hue = random(80, 160);
  let saturation = random(65, 100);
  let lightness = random(35, 75);
  let fernColorHSL = [hue, saturation, lightness];
  let baseCurls = random(3, 10);
  let scale2 = random(2, 4);
  maxFerns = 16 - scale2*2.5

  currentFernConfig = {
    frondCount,
    insideDiameter,
    segmentSize,
    strokeMax,
    baseCurls,
    fernColorHSL,
    scale2
  };

  // Store current fern parameters for reuse
  currentFernParams = {
    frondCount,
    segmentSize,
    insideDiameter,
    strokeMax,
    fernColorHSL,
    baseCurls,
    scale2
  };

  fernInstances = [
    new Fern(
      headX || width * 0.5,
      headY || height * 0.4,
      frondCount,
      insideDiameter,
      segmentSize,
      strokeMax,
      baseCurls,
      fernColorHSL,
      scale2,
      0
    )
  ];

  let armPositions = getArmFernPositions();
  armFerns = [
    new Fern(
      armPositions.leftX,
      armPositions.leftY,
      1,
      insideDiameter,
      segmentSize,
      strokeMax,
      baseCurls,
      fernColorHSL,
      scale2,
      0
    ),
    new Fern(
      armPositions.rightX,
      armPositions.rightY,
      1,
      insideDiameter,
      segmentSize,
      strokeMax,
      baseCurls,
      fernColorHSL,
      scale2,
      0
    )
  ];
}

function createFollowerFern() {
  if (!currentFernConfig || !fernInstances.length) return;

  let leader = fernInstances[fernInstances.length - 1];
  fernInstances.push(
    new Fern(
      leader.x,
      leader.y,
      currentFernConfig.frondCount,
      currentFernConfig.insideDiameter,
      currentFernConfig.segmentSize,
      currentFernConfig.strokeMax,
      currentFernConfig.baseCurls,
      currentFernConfig.fernColorHSL,
      currentFernConfig.scale2,
      0
    )
  );
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
    scale2,
    invertDependency = false
  ) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.fronds = [];
    this.invertDependency = invertDependency;
    this.colorHSL = colorHSL;
    this.scale2 = scale2;

    let spacing = TWO_PI / frondCount;
    for (let i = 0; i < frondCount; i++) {
      let curls = baseCurls + i * spacing;
      this.fronds.push(
        new Frond(x, y, insideDiameter, segmentSize, strokeMax, curls, this.colorHSL, this.invertDependency)
      );
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    for (let frond of this.fronds) {
      frond.x = this.x;
      frond.y = this.y;
    }
  }

  update(mx, my) {
    // Scale motion to frame time (assuming 60fps baseline).
    let dt = min(deltaTime, 100) / 16.6667;
    let ax = (mx - this.x) * 0.02;
    let ay = (my - this.y) * 0.02;
    let damping = pow(0.77, dt);
    this.dx = (this.dx + ax * dt) * damping;
    this.dy = (this.dy + ay * dt) * damping;
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    for (let frond of this.fronds) {
      frond.x = this.x;
      frond.y = this.y;
    }
  }

  draw(mx, my, maxDist) {
    for (let frond of this.fronds) {
      frond.draw(this.scale2, mx, my, maxDist);
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
    let prevX, prevY;
    for (let a = curlsAdjusted; a > end; a -= this.segmentSize) {
      let r = this.insideDiameter + a * scale2;
      let x = r * cos(a);
      let y = r * sin(a);

      let segT = map(a, end, curlsAdjusted, 0, 1);
      let sw = map(a, end, curlsAdjusted, 0, this.strokeMax) * lerp(1, 0.6, segT);
      if (this.colorHSL && this.colorHSL.length >= 3) {
        let baseLight = this.colorHSL[2];
        let baseAlpha = this.colorHSL.length > 3 ? this.colorHSL[3] : 1;
        let segLight = constrain(baseLight - segT * FrondFade, 0, 100);
        stroke(this.colorHSL[0], this.colorHSL[1], segLight, baseAlpha);
      }
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

  let maxDist = min(width, height) * 0.75;

  updateHead(mouseX, mouseY);
  BUTTON_RECT.x = headX - BUTTON_RECT.w / 2;
  BUTTON_RECT.y = headY - BUTTON_RECT.h / 2;

  let sideOffset = 10;
  if (armFerns.length >= 2) {
    let armPositions = getArmFernPositions();
    armFerns[0].setPosition(armPositions.leftX, armPositions.leftY);
    armFerns[1].setPosition(armPositions.rightX, armPositions.rightY);
  }

  for (let i = 0; i < fernInstances.length; i++) {
    let fern = fernInstances[i];
    let targetX = headX;
    let targetY = headY;
    if (i !== 0) {
      let leader = fernInstances[i - 1];
      let dx = fern.x - leader.x;
      let dy = fern.y - leader.y;
      let distToLeader = sqrt(dx * dx + dy * dy);
      let desired = 10 * (leader.scale2 || 1);
      if (distToLeader > 0.001) {
        targetX = leader.x + (dx / distToLeader) * desired;
        targetY = leader.y + (dy / distToLeader) * desired;
      } else {
        targetX = fern.x;
        targetY = fern.y;
      }
    }
    fern.update(targetX, targetY);
    fern.draw(targetX, targetY, maxDist);
  }

  drawFernButton(headAngle);
  //drawDebugInfo();

  for (let fern of armFerns) {
    fern.draw(mouseX, mouseY, maxDist);
  }
}

function updateHead(mx, my) {
  let dt = min(deltaTime, 100) / 16.6667;
  let ax = (mx - headX) * 0.03;
  let ay = (my - headY) * 0.03;
  let damping = pow(0.8, dt);
  headDX = (headDX + ax * dt) * damping;
  headDY = (headDY + ay * dt) * damping;
  headX += headDX * dt;
  headY += headDY * dt;

  let targetAngle = constrain(headDX * 0.02, -0.35, 0.35);
  headAngleVel = (headAngleVel + (targetAngle - headAngle) * 0.2 * dt) * pow(0.7, dt);
  headAngle += headAngleVel * dt;
}

function getArmFernPositions() {
  let armYOffset = BUTTON_RECT.h * 0.4;
  let armSpread = BUTTON_RECT.w * 0.5;
  let cosA = cos(headAngle);
  let sinA = sin(headAngle);
  let topX = headX + sinA * armYOffset;
  let topY = headY - cosA * armYOffset;
  return {
    leftX: topX - armSpread * cosA,
    leftY: topY - armSpread * sinA,
    rightX: topX + armSpread * cosA,
    rightY: topY + armSpread * sinA
  };
}

let eyeArray = "@#^*-+=07QQWTYUIO7AHXV<>~:x"
let mouthArray = "-__wov<>,..!"
let buttonEyes = "-";
let buttonMouth = ".";
let buttonText = "-.-";
let lastWillResetNext = false;
function drawFernButton(angle = 0) {
  updateButtonFace();
  let buttonColor = getCurrentFernColor();
  push();
  noStroke();
  translate(headX, headY);
  rotate(angle);
  translate(-BUTTON_RECT.w / 2, -BUTTON_RECT.h / 2);
  if (buttonColor) {
    fill(
      buttonColor[0],
      buttonColor[1],
      buttonColor[2],
      buttonColor.length > 3 ? buttonColor[3] : 1
    );
  }
  rect(0, 0, BUTTON_RECT.w, BUTTON_RECT.h, BUTTON_RECT.r);

  let l = buttonColor ? constrain(buttonColor[2] + (buttonColor[2] > 55 ? -18 : 18), 0, 100) : 20;
  fill(buttonColor ? buttonColor[0] : 0, buttonColor ? buttonColor[1] : 0, l, buttonColor?.[3] ?? 1);
  textAlign(CENTER, CENTER);
  textSize(48);
  text(buttonText, BUTTON_RECT.w / 2, BUTTON_RECT.h / 2);
  pop();
}

function getCurrentFernColor() {
  if (fernInstances.length && fernInstances[0].colorHSL) {
    return fernInstances[0].colorHSL;
  }
  return null;
}

function mousePressed() {
  if (fernInstances.length >= maxFerns) {
    createRandomFern();
    randomizeButtonFace();
  } else {
    createFollowerFern();
  }
}

function isOverButton(mx, my) {
  return (
    mx >= BUTTON_RECT.x && mx <= BUTTON_RECT.x + BUTTON_RECT.w &&
    my >= BUTTON_RECT.y && my <= BUTTON_RECT.y + BUTTON_RECT.h
  );
}

function drawDebugInfo() {
  let baseCurls = currentFernConfig ? currentFernConfig.baseCurls : null;
  push();
  textAlign(RIGHT, TOP);
  textSize(16);
  fill(0, 0, 0, 0.8);
  text(
    `baseCurls: ${baseCurls !== null ? formatPi(baseCurls) : "n/a"}`,
    width - 20,
    20
  );
  text(`maxFerns: ${maxFerns}`, width - 20, 40);
  pop();
}

function formatPi(value) {
  let k = floor(value / PI);
  let remainder = value - k * PI;
  return `${k}PI+${remainder.toFixed(2)}`;
}

function randomizeButtonFace() {
  buttonEyes = eyeArray[floor(random(eyeArray.length))];
  buttonMouth = mouthArray[floor(random(mouthArray.length))];
  buttonText = `${buttonEyes}${buttonMouth}${buttonEyes}`;
}

function updateButtonFace() {
  let willResetNext = fernInstances.length >= maxFerns;
  if (willResetNext && !lastWillResetNext) {
    let nextMouth = mouthArray[floor(random(mouthArray.length))];
    if (nextMouth === buttonMouth && mouthArray.length > 1) {
      nextMouth = mouthArray[(mouthArray.indexOf(nextMouth) + 1) % mouthArray.length];
    }
    buttonMouth = nextMouth;
    buttonText = `${buttonEyes}${buttonMouth}${buttonEyes}`;
  }
  lastWillResetNext = willResetNext;
}
//ideas:
// add successive buttons to lock/pulsate the parameters
// tie emoji's to actual properties
