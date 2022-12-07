let canvas_l = 500;
let canvas_h = 500;

let smoothness = 1; // Distance between each horizontal location
let left_dist = canvas_l/5;
let right_dist = canvas_l/5;
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let yvalues; // Using an array to store height values for the wave
let amp_const = 10;
let color;
let thickness;

let seed = 53871;

let color_mode = 0;
let thickness_range = 30;
let style;

let canvas;
let type = 'Mayan';

function generate() {
  //saveArt(get());
  var but = document.getElementById("generate");
  seed = random(999999999);
  clear();
  canvas = createCanvas(canvas_l, canvas_h);
  yvalues.fill(0);
  background(255);
  genWave();
  calcColors(color_mode);
  renderWave();
  saveCanvas(c, 'squiggle', 'jpg');
}

function clearCanvas() {
  clear();
}

function setup() {
  canvas = createCanvas(canvas_l, canvas_h);
  yvalues = new Array(width - right_dist - left_dist);
  yvalues.fill(0);
  color = Array(yvalues.length);
  genWave();
  calcColors(color_mode);
  noLoop();
}

function draw() {
  if(type == 'Mayan') {
    setupMayan();
    drawMayan();
  } else if(type == 'Squiggles') {
    background(255);
    //update();
    renderWave();
  }
}

function swtichColor(mode) {
  calcColors(mode);
}

function calcColors(mode) {
  if(mode == 0) {
    color_off = random(360);
    color_freq = random(720);
    for(let i = 0; i < color.length; i++) {
      color[i] = (floor(i/color.length*(360+color_freq)) + color_off) % 360;
    }
  } else if (mode == 1) {
    
  }
}


function genWave() {
  style = random();
  let num_waves = random(10, 30);
  for(let i = 0; i < num_waves; i++) {
    //angular velocity
    theta += 0.02;
    let x = theta;

    //unique wave
    let amplitude = random(canvas_h/(5*num_waves), canvas_h/(2*num_waves) + amp_const);
    let period = random(canvas_l/10, canvas_l/5)*smoothness;
    let phase = random(-PI/2, PI/2);
    thickness = random(5, 5+thickness_range);

    dx = (TWO_PI / period) * smoothness;

    for (let i = 0; i < yvalues.length; i++) {
      yvalues[i] += sin(x + phase) * amplitude;
      x += dx;
    }
  }
}

function update() {
  let temp = yvalues[0];
  for (let i = 1; i < yvalues.length; i++) {
    yvalues[i-1] = yvalues[i];
  }
  yvalues[yvalues.length] = temp;
}

function renderWave() {
  noStroke();
  for (let x = 0; x < yvalues.length; x++) {
    colorMode(HSB);
    fill(color[x], 255, 255);
    var thisy = yvalues[x];
    if(thisy < yvalues[x+1]) {
      for(let i = yvalues[x]; i < yvalues[x+1]; i++) {
        ellipse(x + left_dist, height / 2 + i, thickness, thickness);
      }
    } else {
      for(let i = yvalues[x]; i > yvalues[x+1]; i--) {
        ellipse(x + left_dist, height / 2 + i, thickness, thickness);
      }
    }
  }
}
