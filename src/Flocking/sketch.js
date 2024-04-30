
import {Boids} from "./Boids.js"
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width=window.innerWidth*.9;
canvas.height = window.innerHeight*.8;


const n_Boids = 200;
let flock = [];
const width = canvas.width;
const height = canvas.height;
// test.render(ctx)
function init()
{
  // console.log(height)
  for (let i =0; i < n_Boids; i++)
  {
    flock.push(new Boids())
  }
}


function render(a) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let oldFlock = flock;
  for (let i =0; i<n_Boids; i++)
  {
    flock[i].run(oldFlock,ctx);
    // flock[i].render(ctx);
  }
  requestAnimationFrame(render);

}
init();
requestAnimationFrame(render);
//
