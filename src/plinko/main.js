// Import the necessary modules
const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let button = document.getElementById("button");

// Create an engine

let balls = [];
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.85;
const height = canvas.height * 0.9;
const width = canvas.width;
// Add bodies to the world

class Ball {
	constructor(x, y, r, doesntmove = false, col = 0) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.body = Matter.Bodies.circle(this.x, this.y, this.r, {
			friction: 0.0001,
			restitution: 0.4,
			density: 0.01,
			isStatic: doesntmove,
		});
		if (col === 0) {
			this.color = [
				Math.random() * 255,
				Math.random() * 255,
				Math.random() * 255,
			];
		} else {
			this.color = [70, 70, 90];
		}
		Matter.World.add(engine.world, this.body);
	}
	draw() {
		ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
		ctx.beginPath();
		ctx.arc(
			this.body.position.x,
			this.body.position.y,
			this.r,
			0,
			Math.PI * 2
		);
		ctx.fill();
	}
}

function showBalls() {
	for (let i = balls.length - 1; i > -1; i--) {
		balls[i].draw();
		if (balls[i].body.position.y > canvas.height) {
			Matter.World.remove(engine.world, balls[i].body);
			balls.splice(i, 1);
		}
	}
	if (Math.random() > 0.9) {
		balls.push(new Ball(Math.random() * 1 + width / 2, 0, 4, false, 0));
	}
}
function resetBalls() {
	for (let i = 0; i < balls.length; i++) {
		Matter.World.remove(engine.world, balls[i].body);
		// balls.splice(i, 1);
	}
	balls = [];
}

class StaticRects {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
			isStatic: true,
		});
		this.color = [200, 200, 200];
		Matter.World.add(engine.world, this.body);
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
class GroundAndBins {
	constructor() {
		this.boxes = [];
		this.binSeperation = 30;
		this.offset = 100;
		this.nBins = (width - this.offset * 2) / this.binSeperation;
		this.binHeight = 150;

		this.boxes.push(
			new StaticRects(width / 2, height, width - this.offset * 2, 20)
		);

		for (let i = 0; i < this.nBins; i++) {
			this.boxes.push(
				new StaticRects(
					this.offset + this.binSeperation * i,
					height - this.binHeight / 2,
					2,
					this.binHeight
				)
			);
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
		this.r = 4;
		this.nPegsWidth = (width - this.offset * 2) / this.pegSeperation;
		this.nPegsHeight = (height - this.offset * 2) / this.pegSeperation - 4;
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
				Matter.World.add(engine.world, this.pegs[this.pegs.length - 1]);
			}
		}
	}
	draw() {
		for (let i = 0; i < this.pegs.length; i++) {
			this.pegs[i].draw();
		}
	}
}

const engine = Matter.Engine.create();
let pegs = new Pegs();
let boxes = new GroundAndBins();

button.onclick = function StartAnimation() {
	resetBalls();
};

function render() {
	requestAnimationFrame(render);
	ctx.clearRect(0, 0, width, height);
	showBalls();
	pegs.draw();
	boxes.draw();
	Matter.Engine.update(engine, 10);
}
// Runner.run(engine);
render();
