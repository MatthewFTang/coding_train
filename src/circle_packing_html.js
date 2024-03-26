import "../style.css";
var canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  particles = [];
//   ctx.style.background='white';
// canvas.style.background = "white";

// var colors = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800"];
var colors = ["#a20e0e", "#d8580b", "#f6d354", "#4882b7", "#814a66"];
canvas.width = 800;
canvas.height = 800;
var ww = canvas.width;
var wh = canvas.height;

class Particle {
  constructor(x, y) {
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
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
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
      if (p != this) {
        let dist = Math.sqrt(
          (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
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

var attempts = 0;

function make() {
  while (attempts < 20000) {
    let x = Math.random() * ww;
    let y = Math.random() * wh;
    particles.push(new Particle(x, y));
    for (var i = 0; i < particles.length; i++) {
      particles[i].grow(particles);
    }
  }
}

function render() {
  //   requestAnimationFrame(render);

  //   ctx.fillStyle = "white";
  ctx.fillStyle = "#242424";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    particles[i].render();
  }
}
make();
render();
// requestAnimationFrame(render);
