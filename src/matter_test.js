import "../style.css";

let sketch = function (p) {
  let x = 100;
  let y = 100;
  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  var boxies, c;
  var world;
  p.setup = function () {
    p.createCanvas(800, 800);
    var engine = Engine.create();
    world = engine.world;
    boxies = Bodies.rectangle(200, 200, 80, 80);
    c = Bodies.circle(140, 600, 80);
    Matter.Body.setStatic(c, true);

    // world.ad
    World.add(world, [boxies, c]);
    // Engine.run(engine);
    Matter.Runner.run(engine);
  };

  p.draw = function () {
    p.background(51);
    p.push();
    p.translate(boxies.position.x, boxies.position.y);
    p.rotate(boxies.angle);
    p.rect(0, 0, 80, 80);

    p.pop();
    p.circle(c.position.x, c.position.y, 80);

    p.fill(255);
  };
};

let myp5 = new p5(sketch);
