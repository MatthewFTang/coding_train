const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Create an engine
const engine = Matter.Engine.create();
engine.world.gravity = 1;
const balls = [];

// Ground class definition
class Ground {
	constructor(x, y, w, h, angle) {
		this.x = x;
		this.y = y;
		this.h = h;
		this.w = w;
		this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
			isStatic: true,
			angle: angle,
		});

		this.color = "#7d3636";
		Matter.World.add(engine.world, this.body);
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

// Ball class definition
class Ball {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.body = Matter.Bodies.circle(this.x, this.y, this.r, {
			friction: 0.00001,
			restitution: 0.5,
			density: 0.01,
		});
		this.color = [
			Math.random() * 255,
			Math.random() * 255,
			Math.random() * 255,
		];
		Matter.World.add(engine.world, this.body);
	}
	draw = () => {
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
	};
}

// Function to show balls
function showBalls() {
	for (let i = balls.length - 1; i > -1; i--) {
		balls[i].draw();
		if (balls[i].body.position.y > canvas.height) {
			Matter.World.remove(engine.world, balls[i].body);
			balls.splice(i, 1);
		}
	}
	balls.push(
		new Ball(Math.random() * canvas.width, 0, 5 + Math.random() * 20)
	);
}

// Array to store ground planes
const groundsPlanes = [];

// Function to dynamically create ground planes
function createGroundPlanes() {
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	// Define ground plane properties
	const groundWidth = 20;
	const groundHeight = canvas.height * 0.8;
	const angle = Math.PI / 3;

	// Create left ground plane
	groundsPlanes.push(
		new Ground(
			centerX - 300, // Start left of the center
			centerY - 400, // Slightly above the center
			groundWidth,
			groundHeight,
			-angle // Tilted to the left
		)
	);

	// Create right ground plane
	groundsPlanes.push(
		new Ground(
			centerX + 400, // Start right of the center
			centerY - 100, // Slightly above the center
			groundWidth,
			groundHeight,
			angle // Tilted to the right
		)
	);

	// Create bottom ground plane
	groundsPlanes.push(
		new Ground(
			centerX, // Centered horizontally
			centerY + 200, // Below the center
			groundWidth,
			groundHeight * 1.2, // Shorter height
			-angle // Tilted to the left
		)
	);
}

// Call the function to create ground planes
createGroundPlanes();

// Render function
function render() {
	requestAnimationFrame(render);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 4;
	Matter.Engine.update(engine);
	// Draw ground planes
	for (let i = 0; i < groundsPlanes.length; i++) {
		groundsPlanes[i].draw();
	}

	// Show balls
	showBalls();
}

// Run the engine
Matter.Runner.run(engine);

// Start rendering
render();
