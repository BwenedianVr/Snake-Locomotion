// A few years ago i had made a slither.io engine in scratch that was unlike others; the snake actually pulls the other segments.
// Now that im learning javascript, i decided to try to remake a basic version of it. 
// This is somewhat complex and i should probably try to master the javascript basics first, but thats just boring.
const snakeCanvas = document.getElementById("snakeCanvas");
const stx = snakeCanvas.getContext("2d");

snakeCanvas.width = window.innerWidth;
snakeCanvas.height = window.innerHeight;

let segments = [0, 0];
let lastTime = 0;
let fps = 60;
let interval = 1000 / fps;

let center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
}
let thisObj = {
  f: !null,
  mouse: {
    x: 0,
    y: 0
  },
  camera: {
    x: 0,
    y: 0,
    scrl: 2
  },
  snake: {
    x: 0,
    y: 0,
    speed: 2,
    len: 35,
    size: 10,
    dir: Math.PI,
    color: "rgb(255, 0, 0)"
  },
  current: {
    x: 0,
    y: 0
  },
  last: {
    x: 0,
    y: 0
  },
  data: {
    dis: 0,
    dir: 0
  },
  selected: {
    i: 3,
    x: 0,
    y: 0
  }
}

function setPointer(mx, my) {
  thisObj.mouse.x = mx;
  thisObj.mouse.y = my;
}
function getPointer(i) {
  if (i.type ==='mousemove') {
    setPointer(i.clientX, i.clientY);
  } else if (i.type === 'touchmove') {
      setPointer(i.touches[0].clientX, i.touches[0].clientY);
      i.preventDefault();
  }
}
document.addEventListener('mousemove', getPointer);
document.addEventListener('touchmove', getPointer, { passive: false});

function addSegment() {
  segments[0] = thisObj.snake.x;
  segments[1] = thisObj.snake.y;
  segments[2] = thisObj.snake.dir;
  if (segments.length > thisObj.snake.len * 3) {
    segments.pop();
    segments.pop();
    segments.pop();
    thisObj.f = null;
  } else if (segments.length < thisObj.snake.len) {
    if (!(thisObj.f === null)) {
      segments.push(thisObj.snake.x, thisObj.snake.y, thisObj.snake.dir);  
    }
  }
}

function pointTo(x1, y1, x2, y2) {
  let xx = x1 - x2;
  let yy = y1 - y2;
  thisObj.data.dir = Math.atan2(yy, xx);
  return thisObj.data.dir;
}
function getDistance(x1, y1, x2, y2) {
  let xx = Math.pow(x1 - x2, 2);
  let yy = Math.pow(y1 - y2, 2);
  thisObj.data.dis = Math.sqrt(xx + yy);
}

function updateSegments(spacing) {
  thisObj.selected.i = 5;
  for (let i = 0; i < ((segments.length / 3) - 1); i++) {
    thisObj.current.x = segments[thisObj.selected.i - 2];
    thisObj.current.y = segments[thisObj.selected.i - 1];
    thisObj.last.x = segments[thisObj.selected.i - 5];
    thisObj.last.y = segments[thisObj.selected.i - 4];
    pointTo(thisObj.last.x, thisObj.last.y, thisObj.current.x, thisObj.current.y);
    segments[thisObj.selected.i] = thisObj.data.dir;
    getDistance(thisObj.last.x, thisObj.last.y, thisObj.current.x, thisObj.current.y);
    if (spacing < thisObj.data.dis) {
      let moveBack = thisObj.data.dis - spacing;
      thisObj.current.x += moveBack * Math.cos(segments[thisObj.selected.i]);
      thisObj.current.y += moveBack * Math.sin(segments[thisObj.selected.i]);
    }
    segments[(thisObj.selected.i - 2)] = thisObj.current.x;
    segments[(thisObj.selected.i - 1)] = thisObj.current.y;
    thisObj.selected.i += 3;
  }
}

function drawSnake() {
  thisObj.selected.i = segments.length - 1;
  for (let i = 0; i < (segments.length / 3); i++) {
    thisObj.selected.x = segments[thisObj.selected.i - 2];
    thisObj.selected.y = segments[thisObj.selected.i - 1];
    stx.beginPath();
    stx.arc((thisObj.selected.x - thisObj.camera.x) + center.x, (thisObj.selected.y - thisObj.camera.y) + center.y, thisObj.snake.size, 0, Math.PI * 2);
    stx.fillStyle = thisObj.snake.color;
    stx.fill();
    stx.closePath();
    thisObj.selected.i -= 3;
  }
}

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  if (deltaTime >= interval) {
    thisObj.snake.speed = 5;
    stx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    thisObj.snake.dir = Math.atan2(thisObj.mouse.y - center.y, thisObj.mouse.x - center.x);
    thisObj.snake.x += thisObj.snake.speed * Math.cos(thisObj.snake.dir);
    thisObj.snake.y += thisObj.snake.speed * Math.sin(thisObj.snake.dir);
    thisObj.camera.x = thisObj.snake.x;
    thisObj.camera.y = thisObj.snake.y;
    addSegment();
    updateSegments(thisObj.snake.size);
    drawSnake();
    lastTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
