import { Engine, World, Bodies, Runner } from "matter-js";
import "../style.css";
// Import the necessary modules
var canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// ctx.style.background='white';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an engine
const engine = Engine.create();
var boxes = [];

addEventListener("mousedown", (event) => {
  boxes.push(
    new Box(
      event.offsetX,
      event.offsetY,
      Math.random() * 100,
      Math.random() * 100
    )
  );
});

// Add bodies to the world

// Run the engine

function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = "#242424";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4;
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].draw();
  }
}

class Box {
  constructor(x, y, w, h, moves = false) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {
      isStatic: moves,
    });
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    World.add(engine.world, this.body);
  }
  draw() {
    ctx.save();
    ctx.beginPath();

    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    ctx.strokeStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
    // ctx;
    ctx.rect(-(this.w / 2), -this.h / 2, this.w, this.h);
    ctx.stroke();
    ctx.restore();
  }
}
Runner.run(engine);
boxes.push(new Box(canvas.width / 2, canvas.height - 20, canvas.width, 20, 1));
render();
