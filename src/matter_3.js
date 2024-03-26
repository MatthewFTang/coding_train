import { Engine, Render, World, Bodies } from "matter-js";

// Import the necessary modules

// Create an engine
const engine = Engine.create();

// Create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
});
var boxes = [];
// Create bodies
const box = Bodies.rectangle(400, 200, 80, 80);
const ground = Bodies.rectangle(400, 610, 800, 60, { isStatic: true });

addEventListener("mousedown", (event) => {
  boxes.push(new Box(event.offsetX, event.offsetY, Math.random()*100+1, Math.random()*100+1));
});

// Add bodies to the world
World.add(engine.world, [box, ground]);

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

class Box {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h);
    World.add(engine.world, this.body);
    // this.ctx = ctx;
  }
}
