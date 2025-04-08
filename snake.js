// A few years ago i had made a slither.io engine in scratch that was unlike others; the snake actually pulls the other segments.
// Now that im learning javascript, i decided to try to remake a basic version of it. 
// This is somewhat complex and i should probably try to master the javascript basics first, but thats just boring.
// edit: just to show its not skidded i will explain the logic behind each part
// canvas is kinda self explanitory 
const snakeCanvas = document.getElementById("snakeCanvas");
const stx = snakeCanvas.getContext("2d"); // used stx instead of ctx, it works the exact same since its just the var name. 2d however is just the type of render, the only other kind i know (idk how to use tho) is WebGL
// fit the screen
snakeCanvas.width = window.innerWidth;
snakeCanvas.height = window.innerHeight;
// array and fps control
let segments = [0, 0];
let lastTime = 0;
let fps = 60;
let interval = 1000 / fps; 
// if you know what an object is then ye
let center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
}
let thisObj = {
  f: !null,
  // it took me so long to figure out u dont create objects that are nested inside objects the same way u do to flat objects
  mouse: {
    x: 0,
    y: 0
  },
  camera: {
    x: 0,
    y: 0,
    // unused but was gonna be used for a scrolling effect
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
// self explanitory
function setPointer(mx, my) {
  thisObj.mouse.x = mx;
  thisObj.mouse.y = my;
}
// still trying to memorize this but yea i admit i used google 😭 im new dont judge
function getPointer(i) {
  if (i.type ==='mousemove') {
    setPointer(i.clientX, i.clientY);
  } else if (i.type === 'touchmove') {
      setPointer(i.touches[0].clientX, i.touches[0].clientY);
      i.preventDefault();
  }
}
// this was easy stuff, no google needed
document.addEventListener('mousemove', getPointer);
document.addEventListener('touchmove', getPointer, { passive: false}); // passive: false just tells the browser to not do its default thing or smth like that

// i wasted so much time figuring out how to make this without javascript crashing, ended up using a method that stops it from repeating after it reaches its goal 
function addSegment() {
  segments[0] = thisObj.snake.x;
  segments[1] = thisObj.snake.y;
  segments[2] = thisObj.snake.dir;
  if (segments.length > thisObj.snake.len * 3) {
    // pop deletes last item
    segments.pop();
    segments.pop();
    segments.pop();
    // idk how to explain null but it kinda means false but also doesnt
    thisObj.f = null;
  } else if (segments.length < thisObj.snake.len) {
    if (!(thisObj.f === null)) {
      segments.push(thisObj.snake.x, thisObj.snake.y, thisObj.snake.dir);  
    }
  }
}
// trig
function pointTo(x1, y1, x2, y2) {
  let xx = x1 - x2;
  let yy = y1 - y2;
  thisObj.data.dir = Math.atan2(yy, xx);
  return thisObj.data.dir; // used for testing
}
// geometry
function getDistance(x1, y1, x2, y2) {
  let xx = Math.pow(x1 - x2, 2);
  let yy = Math.pow(y1 - y2, 2);
  thisObj.data.dis = Math.sqrt(xx + yy);
}
// this caused some trouble along the development process
function updateSegments(spacing) {
  thisObj.selected.i = 5; // it isnt 6 bc in js arrays (lists) start with 0 and not 1
  // i also did that since the head of the snake doesnt need to be dragged at all so it instead starts with the second segment
  for (let i = 0; i < ((segments.length / 3) - 1); i++) {
    // get current segment pos
    thisObj.current.x = segments[thisObj.selected.i - 2];
    thisObj.current.y = segments[thisObj.selected.i - 1];
    // get last segment pos
    thisObj.last.x = segments[thisObj.selected.i - 5];
    thisObj.last.y = segments[thisObj.selected.i - 4];
    // sees if its too far away
    pointTo(thisObj.last.x, thisObj.last.y, thisObj.current.x, thisObj.current.y);
    segments[thisObj.selected.i] = thisObj.data.dir;
    getDistance(thisObj.last.x, thisObj.last.y, thisObj.current.x, thisObj.current.y);
    if (spacing < thisObj.data.dis) {
      // if it is, it moves so its within the max distance
      let moveBack = thisObj.data.dis - spacing;
      thisObj.current.x += moveBack * Math.cos(segments[thisObj.selected.i]);
      thisObj.current.y += moveBack * Math.sin(segments[thisObj.selected.i]);
    }
    // replaces the item with the new fixed item
    segments[(thisObj.selected.i - 2)] = thisObj.current.x;
    segments[(thisObj.selected.i - 1)] = thisObj.current.y;
    // increases the selected array target by how much data is stored every segment
    thisObj.selected.i += 3;
  }
}
// i dont need to explain this anyone can make it
function drawSnake() {
  thisObj.selected.i = segments.length - 1;
  for (let i = 0; i < (segments.length / 3); i++) {
    thisObj.selected.x = segments[thisObj.selected.i - 2];
    thisObj.selected.y = segments[thisObj.selected.i - 1];
    stx.beginPath();
    // subtract pos - camera to create the illusion of scrolling!
    stx.arc((thisObj.selected.x - thisObj.camera.x) + center.x, (thisObj.selected.y - thisObj.camera.y) + center.y, thisObj.snake.size, 0, Math.PI * 2);
    stx.fillStyle = thisObj.snake.color;
    stx.fill();
    stx.closePath();
    thisObj.selected.i -= 3;
  }
}
// i originally didnt use timestamp but added it trying to help fix the crashes, but it didnt help so now its just a useless feature
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  if (deltaTime >= interval) {
    thisObj.snake.speed = 5;
    // clear canvas
    stx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    // point to the mouse
    thisObj.snake.dir = Math.atan2(thisObj.mouse.y - center.y, thisObj.mouse.x - center.x);
    thisObj.snake.x += thisObj.snake.speed * Math.cos(thisObj.snake.dir);
    thisObj.snake.y += thisObj.snake.speed * Math.sin(thisObj.snake.dir);
    // scroll camera
    thisObj.camera.x = thisObj.snake.x;
    thisObj.camera.y = thisObj.snake.y;
    addSegment();
    updateSegments(thisObj.snake.size);
    drawSnake();
    lastTime = timestamp;
  }
  // loop
  requestAnimationFrame(gameLoop);
}
// run game
requestAnimationFrame(gameLoop);
