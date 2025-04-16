let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;
let rows = canvas.height;
let columns = canvas.width;
let current = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let previous = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let initial_val = 600;
let damping = 0.99;
previous[199][299] = initial_val;
let buffer = new Uint8ClampedArray(columns * rows * 4); // have enough bytes
animate();

function animate() {
	if (Math.random() > 0.2) {
		previous[Math.floor(Math.random() * columns)][
			Math.floor(Math.random() * rows)
		] = 300 + Math.random() * 1200;
	}
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	for (let x = 1; x < columns - 1; x++) {
		for (let y = 1; y < rows - 1; y++) {
			current[x][y] =
				(previous[x - 1][y] +
					previous[x + 1][y] +
					previous[x][y - 1] +
					previous[x][y + 1]) /
					2 -
				current[x][y];

			current[x][y] = current[x][y] * damping;
			// context.beginPath()
			// context.fillStyle=`rgba(${255-current[x][y]},${255-current[x][y]},${255-current[x][y]},1)`
			// context.arc(x, y, 1, 0, 2 * Math.PI);
			// context.fill();
			const pos = (x + y * columns) * 4;
			buffer[pos] = 255 - current[x][y];
			buffer[pos + 1] = 255 - current[x][y];
			buffer[pos + 2] = 255 - current[x][y];
			buffer[pos + 3] = 255;
		}
	}
	let temp = previous;
	previous = current;
	current = temp;

	let idata = context.createImageData(columns, rows);
	idata.data.set(buffer);
	context.putImageData(idata, 0, 0);

	requestAnimationFrame(animate);
}
