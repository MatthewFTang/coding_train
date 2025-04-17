import SimplexNoise from "https://unpkg.com/simplex-noise@3.0.0/dist/esm/simplex-noise.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight * 0.8;
canvas.width = window.innerWidth * 0.9;

let button = document.getElementById("button");

function flow_field() {
	var simplex = new SimplexNoise();

	const steps = 1000000;
	let current_x = Math.floor(canvas.width / 2);
	let current_y = Math.floor(canvas.height / 2);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const scl = 0.002;
	ctx.strokeStyle = `rgba(0,0,0,0.1)`;
	let currentStep = 0;

	for (let i = 0; i < steps; i++) {
		let dir = simplex.noise2D(current_x * scl, current_y * scl) * Math.PI;
		let v = 5;
		let dx = v * Math.cos(dir);
		let dy = v * Math.sin(dir);
		let next_x = current_x + dx;
		let next_y = current_y + dy;

		if (
			current_x < 0 ||
			current_x >= canvas.width ||
			current_y < 0 ||
			current_y >= canvas.height ||
			currentStep > 300
		) {
			next_x = Math.random() * canvas.width;
			next_y = Math.random() * canvas.height;
			current_y = next_y;
			current_x = next_x;
			currentStep = 0;
		}
		currentStep++;
		ctx.beginPath();
		ctx.moveTo(current_x, current_y);
		ctx.lineTo(next_x, next_y);
		ctx.stroke();
		ctx.lineWidth = 1;
		current_x = next_x;
		current_y = next_y;
	}
}

// Load colors and start the flow field
flow_field();

button.onclick = function StartAnimation() {
	var simplex = new SimplexNoise();

	flow_field();
};
