const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;

let button = document.getElementById("button");
let colorSpeed = document.getElementById("colorSpeed");
let speedSlider = document.getElementById("speedSlider");
let movingButton = document.getElementById("button_moving");

let moving = true;
movingButton.onclick = function () {
	moving = !moving;
	if (moving) {
		movingButton.innerHTML = "Stop";
	} else {
		movingButton.innerHTML = "Start";
	}
};

let dots;
colorSpeed.oninput = function () {
	colorSpeedValue = this.value;
};

button.onclick = function () {
	dots = new DotsArray(n_dots);
};
let speed = 0.01;
speedSlider.oninput = function () {
	speed = this.value;
};

let width = canvas.width;
let height = canvas.height;

const n_dots = 200;
const outer_radius = height / 2 - 20;
const inner_radius = 100;
let colorSpeedValue = 1;

class DotsArray {
	constructor(nDots) {
		this.dotArray = [];
		this.makeDots();
		this.attempts = 0;
	}

	makeDots() {
		while (this.attempts < 200 || this.dotArray.length < n_dots) {
			let x = -(width / 2) + Math.random() * width;
			let y = -(height / 2) + Math.random() * height;
			let dist = x * x + y * y;
			let r = 10 + Math.random() * 10;
			let overlap = this.overlapping(x, y, r);
			while (
				dist > outer_radius * outer_radius ||
				dist < inner_radius * inner_radius ||
				overlap
			) {
				x = -(width / 2) + Math.random() * width;
				y = -(height / 2) + Math.random() * height;
				dist = x * x + y * y;
				overlap = this.overlapping(x, y, r);
				this.attempts++;
				if (this.attempts > 2000) {
					break;
				}
			}
			if (this.attempts > 2000) {
				break;
			}
			// this.dotColorAngle.push();
			this.dotArray.push({
				x: x,
				y: y,
				r: r,
				colorAngle: Math.random() * 360,
			});
		}
	}

	updateColor() {
		for (let d of this.dotArray) {
			d.colorAngle += colorSpeedValue % 360;
			let dist = d.x * d.x + d.y * d.y;
			// let ang  = Math.atan2(d.y,d.x);
			if (moving) {
				let ang = speed;
				let dx = d.x * Math.cos(ang) + d.y * Math.sin(ang);
				let dy = -d.x * Math.sin(ang) + d.y * Math.cos(ang);
				d.x = dx;
				d.y = dy;
			}

			// d.y =dist * Math.sin(0) ;
		}
	}

	overlapping(x, y, r) {
		for (let d of this.dotArray) {
			let dist = (x - d.x) * (x - d.x) + (y - d.y) * (y - d.y);
			if (dist < (r + d.r) * (r + d.r)) {
				return true;
			}
		}
		return false;
	}

	show() {
		for (let d of this.dotArray) {
			// console.log(d)
			ctx.beginPath();
			ctx.fillStyle = `hsl(${d.colorAngle},100%,50%)`;
			ctx.arc(d.x + width / 2, d.y + height / 2, d.r, 0, 2 * Math.PI);
			ctx.fill();
		}
		this.updateColor();
	}
}

function makeFixation() {
	let fixationSize = 20;
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.moveTo(width / 2 - fixationSize, height / 2);
	ctx.lineTo(width / 2 + fixationSize, height / 2);

	ctx.moveTo(width / 2, height / 2 - fixationSize);
	ctx.lineTo(width / 2, height / 2 + fixationSize);

	ctx.stroke();
}

dots = new DotsArray(n_dots);

function animation() {
	ctx.clearRect(0, 0, width, height);
	dots.show();
	makeFixation();

	requestAnimationFrame(animation);
}

animation();
