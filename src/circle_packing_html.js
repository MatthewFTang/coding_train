import data from "../src/assets/colors.json";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;
const ww = canvas.width;
const wh = canvas.height;

let button = document.getElementById("start");
let colors = data[0]["4"];
button.onclick = function () {
	let col = Math.floor(Math.random() * 4345);
	colors = data[0][col];

	makeAndDisplay();
};

class Particle {
	constructor(x, y, colors) {
		this.x = x;
		this.y = y;

		this.r = 0;
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.growing = true;
		this.growCount = 0;
	}

	render() {
		// ctx.stroke();

		if (this.growCount > 1) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	grow(particles) {
		if (this.growing) {
			this.growing = !this.edge();
			this.overlapping(particles);
			if (this.growing) {
				this.r += 1;
				this.growCount++;
			}
		}
	}

	edge() {
		return (
			this.x + this.r > ww ||
			this.y + this.r > wh ||
			this.x - this.r < 0 ||
			this.y - this.r < 0
		);
	}

	overlapping(particles) {
		for (let p of particles) {
			if (p !== this) {
				let dist = Math.sqrt(
					(this.x - p.x) * (this.x - p.x) +
						(this.y - p.y) * (this.y - p.y)
				);
				if (dist < this.r + p.r) {
					this.growing = false;
					p.growing = false;
					attempts++;
					break;
				}
			}
		}
	}
}

let attempts = 0;
function makeAndDisplay() {
	attempts = 0;
	let particles = [];

	while (attempts < 20000) {
		let x = Math.random() * ww;
		let y = Math.random() * wh;
		particles.push(new Particle(x, y, colors));
		for (let i = 0; i < particles.length; i++) {
			particles[i].grow(particles);
		}
	}
	ctx.fillStyle = "black";
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < particles.length; i++) {
		particles[i].render();
	}
}

makeAndDisplay();
