import { Engine, World, Bodies, Runner, Composite } from "matter-js";
import "../../style.css";
// Import the necessary modules
var canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// ctx.style.background='white';

// Create an engine

var balls = [];
// Add bodies to the world

class Ball {
  constructor(x, y, r, doesntmove = false, col = 0) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.body = Bodies.circle(this.x, this.y, this.r, {
      friction: 0.0001,
      restitution: 0.4,
      density: 0.01,
      isStatic: doesntmove,
    });
    if (col == 0) {
      this.color = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ];
    } else {
      this.color = [255, 255, 255];
    }
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
  for (let i = balls.length - 1; i > -1; i--) {
    balls[i].draw();
    if (balls[i].body.position.y > canvas.height) {
      Composite.remove(engine.world, balls[i].body);
      balls.splice(i, 1);
    }
  }
  if (Math.random() > 0.2) {
    balls.push(new Ball(Math.random() * 1 + canvas.width / 2, 0, 4, false, 0));
  }
}
class Box {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
      isStatic: true,
    });
    this.color = [255, 255, 255];
    World.add(engine.world, this.body);
  }
  draw() {
    ctx.save();
    ctx.beginPath();

    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]}`;
    ctx.rect(-(this.w / 2), -this.h / 2, this.w, this.h);
    ctx.fill();
    ctx.restore();
  }
}
class boxStaticObjects {
  constructor() {
    this.boxes = [];
    this.binSeperation = 30;
    this.nBins = canvas.width / this.binSeperation;
    this.boxes.push(
      new Box(canvas.width / 2, canvas.height - 20, canvas.width, 20)
    );

    for (let i = 0; i < this.nBins; i++) {
      this.boxes.push(new Box(this.binSeperation * i, canvas.height, 2, 350));
    }
  }
  draw() {
    for (let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].draw();
    }
  }
}

class Pegs {
  constructor() {
    this.offset = 100;
    this.pegSeperation = 20;
    this.r = 2;
    this.nPegsWidth = (canvas.width - this.offset * 2) / this.pegSeperation;
    this.nPegsHeight =
      (canvas.height - this.offset * 2) / this.pegSeperation - 4;
    this.pegs = [];
    this.makePegs();
    console.log(this);
  }
  makePegs() {
    for (let y = 0; y < this.nPegsHeight; y++) {
      for (let x = 0; x < this.nPegsWidth; x++) {
        this.pegs.push(
          new Ball(
            x * this.pegSeperation +
              this.offset +
              ((y % 2) * this.pegSeperation) / 2,
            y * this.pegSeperation + this.offset,
            this.r,
            true,
            1
          )
        );
        World.add(engine.world, this.pegs[this.pegs.length - 1]);
      }
    }
  }
  draw() {
    for (let i = 0; i < this.pegs.length; i++) {
      this.pegs[i].draw();
    }
  }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = Engine.create();
let pegs = new Pegs();
let boxes = new boxStaticObjects();
function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = "#242424";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  showBalls();
  pegs.draw();
  boxes.draw();
  Engine.update(engine, 10)
}
// Runner.run(engine);
render();
