import "../style.css";

let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

// canvas.style.background = "white";

// let current = [canvas.width][canvas.height];
// let previous = [canvas.width][canvas.height];
let rows = 500;
let columns = 500;
canvas.width = rows;
canvas.height = columns;

let current = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let previous = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let inital_val = 600;
// console.log(current);
let damping = 0.995;
previous[199][299] = inital_val;
let buffer = new Uint8ClampedArray(columns * rows * 4); // have enough bytes
animate();

function animate() {
  if (Math.random() > 0.9) {
    previous[Math.floor(Math.random() * columns)][
      Math.floor(Math.random() * rows)
    ] = inital_val;
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

      var pos = (x + y * columns) * 4;
      buffer[pos] = current[x][y];
      buffer[pos + 1] = current[x][y];
      buffer[pos + 2] = current[x][y];
      buffer[pos + 3] = 255;
    }
  }
  var idata = context.createImageData(columns, rows);
  idata.data.set(buffer);
  context.putImageData(idata, 0, 0);
  let temp = previous;
  previous = current;
  current = temp;

  requestAnimationFrame(animate);
}
