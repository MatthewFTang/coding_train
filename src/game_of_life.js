const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;
let button = document.getElementById("button");

let ww = canvas.width;
let wh = canvas.height;
class GameOfLife {
	constructor() {
		this.gridSize = 5;
		this.rows = 300;
		this.cols = 200;
		this.grid = [];
		this.spawn_prob = 0.5;
		this.offset = 10;
		this.frameCount = 0;
		this.makeCells();
	}
	render() {
		this.drawCells();

		// this.drawGrid();
		// if (this.frameCount % 1 == 0) {
		this.updateCells();
		// }
		this.frameCount++;
	}
	updateCells() {
		let next = this.make2Darray();
		for (let x = 0; x < this.rows; x++) {
			for (let y = 0; y < this.cols; y++) {
				let sum = this.neighbours(x, y);

				if (this.grid[x][y] == 0 && sum == 3) {
					next[x][y] = 1;
				} else if (this.grid[x][y] == 1 && (sum < 2 || sum > 3)) {
					next[x][y] = 0;
				} else {
					next[x][y] = this.grid[x][y];
				}
			}
		}
		this.grid = next;
	}

	make2Darray() {
		let next = [];
		for (let x = 0; x < this.rows; x++) {
			let temp = [];
			for (let y = 0; y < this.cols; y++) {
				temp.push(0);
			}
			next.push(temp);
		}
		return next;
	}
	neighbours(x, y) {
		let sum = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let row = (x + i + this.rows) % this.rows;
				let cols = (y + j + this.cols) % this.cols;
				sum += this.grid[row][cols];
			}
		}
		sum -= this.grid[x][y];

		return sum;
	}

	makeCells() {
		let r;
		let next = this.make2Darray();
		for (let x = 0; x < this.rows; x++) {
			for (let y = 0; y < this.cols; y++) {
				if (Math.random() > this.spawn_prob) {
					next[x][y] = 1;
				} else {
					next[x][y] = 0;
				}
			}
		}
		this.grid = next;
	}

	drawCells() {
		for (let x = 0; x < this.rows; x++) {
			for (let y = 0; y < this.cols; y++) {
				if (this.grid[x][y] === 1) {
					ctx.fillStyle = "black";
				} else {
					ctx.fillStyle = "#f4f4f4";
				}
				ctx.fillRect(
					this.offset + x * this.gridSize,
					this.offset + y * this.gridSize,
					this.gridSize,
					this.gridSize
				);
			}
		}
	}
	drawGrid() {
		for (let x = 0; x < this.rows; x++) {
			this.drawLine(
				x * this.gridSize + this.offset,
				this.offset,
				x * this.gridSize + this.offset,
				this.offset + this.gridSize * this.cols
			);
		}
		for (let y = 0; y < this.rows; y++) {
			this.drawLine(
				this.offset,
				y * this.gridSize + this.offset,
				this.rows * this.gridSize + this.offset,
				y * this.gridSize + this.offset
			);
		}
	}
	drawLine(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.strokeStyle = "grey";
		// ctx.strokeWeight = 20;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
}
let app = new GameOfLife();
button.onclick = function StartAnimation() {
	app.makeCells();
};

function render(a) {
	requestAnimationFrame(render);
	//   ctx.clearRect(0, 0, canvas.width, canvas.height);
	app.render();
}

requestAnimationFrame(render);
