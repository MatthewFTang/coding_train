import { Circle } from "./Circle.js";
// import "../style.css";
import fs from 'fs';
let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;
// canvas.style.background = "white";

let dots = [];
let nDots = 100;
for (let i = 0; i < nDots; i++) {
  let circle = new Circle();

  dots.push(circle);
}
let start = performance.now();
animate();
function animate() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < dots.length; i++) {
    dots[i].display(context);
  }

  requestAnimationFrame(animate);
}
