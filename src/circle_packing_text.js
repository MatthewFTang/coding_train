import "../style.css";
var canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  particles = [];
// canvas.style.background = "white";

var colors = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800"];

canvas.width = 100;
canvas.height = 100;
var ww = canvas.width;
var wh = canvas.height;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.r = 0;
    this.color = colors[Math.floor(Math.random() * 6)];
    this.growing = true;
  }

  render(particles) {
    // ctx.stroke();
    if (this.growing) {
      this.grow();
      this.growing = !this.edge();
      this.overlapping(particles);
    }
    if (this.r > 1) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
    }
  }
  grow() {
    this.r += 1;
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
      if (p != this) {
        let dist = Math.sqrt(
          (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
        );
        if (dist < this.r + p.r) {
          this.growing = false;
          attempts++;
          break;
        }
      }
    }
  }
}

var data;
var attempts = 0;
function initScene() {
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold " + ww / 3 + "px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText(copy.value, ww / 2, wh / 2);

  data = ctx.getImageData(0, 0, ww, wh).data;
}

function render(a) {
  if (attempts < 10000) {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = Math.random() * ww;
    let y = Math.random() * wh;
    particles.push(new Particle(x, y));
    for (var i = 0; i < particles.length; i++) {
      particles[i].render(particles);
    }
  }
}

initScene();
requestAnimationFrame(render);
