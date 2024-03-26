import { Engine, World, Bodies, Runner, Composite } from "matter-js";
import "../style.css";
// Import the necessary modules
var canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// ctx.style.background='white';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an engine
const engine = Engine.create();

var balls = [];
// Add bodies to the world

// Run the engine

class Ground {
  constructor(x, y, w, h, angle) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
      isStatic: true,
      angle: angle,
    });

    this.color = "#ffffff";
    World.add(engine.world, this.body);
  }
  draw() {
    ctx.save();
    ctx.beginPath();

    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    // ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
    ctx.fillStyle = this.color;
    ctx.rect(-(this.w / 2), -this.h / 2, this.w, this.h);
    // ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}
class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.body = Bodies.circle(this.x, this.y, this.r, {
      friction: 0.00001,
      restitution: 0.5,
      density: 0.001,
    });
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    World.add(engine.world, this.body);
  }
  draw() {
    ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
    ctx.beginPath();
    ctx.arc(this.body.position.x, this.body.position.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
function showBalls() {
  let temp = [];
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    if (balls[i].body.position.y < canvas.height) {
      temp.push(balls[i]);
    } else {
      Composite.remove(engine.world, balls[i].body);
    }
  }
  balls = temp;
  console.log(balls.length);

  if (Math.random() > 0.2) {
    balls.push(new Ball(350 + Math.random() * 600, 0, Math.random() * 40));
  }
}
function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = "#242424";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4;
  for (let i = 0; i < groundsPlanes.length; i++) {
    groundsPlanes[i].draw();
  }
  showBalls();
}

var groundsPlanes = [];
groundsPlanes.push(new Ground(350, 450, 20, 700, -Math.PI / 3));
groundsPlanes.push(new Ground(900, 700, 20, 700, Math.PI / 3));
groundsPlanes.push(new Ground(350, 1000, 20, 700, -Math.PI / 3));

Runner.run(engine);

render();
