import "../style.css";

let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

// canvas.style.background = "white";
let rows = 600;
let columns = 600;
// canvas.width = rows;
// canvas.height = columns;

let current = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let previous = new Array(columns).fill(0).map((n) => new Array(rows).fill(0));
let initial_val = 600;
// console.log(current);
let damping = 0.99;
previous[199][299] = initial_val;
let buffer = new Uint8ClampedArray(columns * rows * 4); // have enough bytes
animate();

function animate() {
  if (Math.random() > 0.4) {
    previous[Math.floor(Math.random() * columns)][
      Math.floor(Math.random() * rows)
    ] = 300+ Math.random()*600;
  }
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let x = 1; x < rows - 1; x++) {
    for (let y = 1; y < columns - 1; y++) {
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
  var idata = context.createImageData(columns,rows);
  idata.data.set(buffer);
  context.putImageData(idata, 0, 0);
  let temp = previous;
  previous = current;
  current = temp;

  requestAnimationFrame(animate);
}
