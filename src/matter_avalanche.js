import { Engine, World, Bodies, Runner, Composite } from "matter-js";
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Create an engine
const engine = Engine.create();

const balls = [];
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

    this.color = "#7d3636";
    World.add(engine.world, this.body);
  }
  draw() {
    ctx.save();
    ctx.beginPath();

    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    ctx.fillStyle = this.color;
    ctx.rect(-(this.w / 2), -this.h / 2, this.w, this.h);
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
      density: 0.01,
    });
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    World.add(engine.world, this.body);
  }
  draw = () => {
    ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
    ctx.beginPath();
    ctx.arc(this.body.position.x, this.body.position.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  };
}
function showBalls() {
  for (let i = balls.length - 1; i > -1; i--) {
    balls[i].draw();
    if (balls[i].body.position.y > canvas.height) {
      Composite.remove(engine.world, balls[i].body);
      balls.splice(i, 1);
    }
  }

  balls.push(new Ball(Math.random() * canvas.width, 0, 5 + Math.random() * 20));
}

// window.addEventListener("resize", function () {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });
const groundsPlanes = [];

function render() {
  requestAnimationFrame(render);
  // ctx.fillStyle = "hsl(120,0%,14%)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4;
  for (let i = 0; i < groundsPlanes.length; i++) {
    groundsPlanes[i].draw();
  }
  showBalls();
  // console.log('1')
}

groundsPlanes.push(new Ground(350, 250, 20, 900, -Math.PI / 3));
groundsPlanes.push(new Ground(1300, 420, 20, 1100, Math.PI / 3));
groundsPlanes.push(new Ground(550, 800, 20, 700, -Math.PI / 3));

Runner.run(engine);

render();
