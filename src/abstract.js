import data from "../src/assets/colors.json";
const color_palette = data[0];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const remakeButton = document.getElementById("start");
const blurSlider = document.getElementById("BlurSlider");
let colors;

let which_col = Math.floor(Math.random() * 4345);

remakeButton.onclick = function () {
	which_col = Math.floor(Math.random() * 4345);
	drawImage();
};
let blurFactor = 4;
blurSlider.oninput = function () {
	blurFactor = this.value;
	drawImage();
};
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

const n_boxes = 150;

class Box {
	constructor() {
		this.x = -100 + Math.random() * canvas.width;
		this.y = -100 + Math.random() * canvas.height;
		this.w = 20 + Math.random() * 300;
		this.h = 20 + Math.random() * 300;
		let hexColor = colors[Math.floor(Math.random() * colors.length)];
		let c = hex2rgb(hexColor);
		this.color = `rgba(${c.r},${c.g},${c.b},1)`;
	}

	display() {
		if (Math.random() > 0.5) {
			ctx.globalCompositeOperation = "hard-light";
		} else {
			ctx.globalCompositeOperation = "darken";
		}
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
const hex2rgb = (hex) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return { r, g, b };
};
let r, g, b, a;
function createPixelNoise() {
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < imageData.data.length; i += 4) {
		// Modify pixel data
		if (Math.random() > 0.5) {
			r = 4;
		} else {
			r = -4;
		}
		imageData.data[i] += r;
		imageData.data[i + 1] += r;
		imageData.data[i + 2] += r;
	}
	ctx.putImageData(imageData, 0, 0);
}
function applyBlur() {
	const blurredRect = {
		x: 0,
		y: 0,
		width: canvas.width,
		height: canvas.height,
		spread: blurFactor,
	};
	//
	ctx.filter = "blur(" + blurredRect.spread + "px)";
	ctx.drawImage(
		canvas,
		blurredRect.x,
		blurredRect.y,
		blurredRect.width,
		blurredRect.height,
		blurredRect.x,
		blurredRect.y,
		blurredRect.width,
		blurredRect.height
	);
	createPixelNoise();
}
function drawImage() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	applyBlur();

	colors = color_palette[which_col];
	for (let i = 0; i < n_boxes; i++) {
		let box = new Box();
		box.display(ctx);
	}
}

drawImage();
