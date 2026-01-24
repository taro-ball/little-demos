function showVars(vars) {
  push();
  fill(0);
  noStroke();
  textSize(14);
  let y = 20;
  for (let [name, value] of Object.entries(vars)) {
    text(name + ": " + (typeof value === 'number' ? value.toFixed(2) : value), 10, y);
    y += 20;
  }
  pop();
}

function setup() {
  createCanvas(900, 900);
  segmentSize = 0.1;
  insideDiameter = 5;
  curls=PI*2.5; //2-2.7

}

function draw() {
  background(255);
  stroke(34, 139, 34);
  
  noFill();

  let curls = map(mouseX, 0, width, 12, 18);
  let scale2 = map(mouseY, 0, height, 0.5, 30);
  let myStroke = 5//map(mouseY, 0, height, 0, 8);
  let end = 0;

  // Calculate stalk base position (at a=curls) and translate so it stays fixed
  let baseR = insideDiameter + curls * scale2;
  let baseX = baseR * cos(curls);
  let baseY = baseR * sin(curls);

  showVars({ curls, scale2 });

  stroke(34, 139, 34);
  noFill();
  translate(350 - baseX, 350 - baseY);

  let prevX, prevY;
  for (let a = curls; a > end; a -= segmentSize) {
    let r = insideDiameter+a*scale2;
    let x = r * cos(a);
    let y = r * sin(a);

    let sw = map(a, end, curls, 0, myStroke);
    strokeWeight(sw);

    if (prevX !== undefined) {
      line(prevX, prevY, x, y);
    }
    prevX = x;
    prevY = y;
  }
}
