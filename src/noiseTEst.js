import "../style.css";
var canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
import { createNoise3D } from 'simplex-noise';
const noise3D = createNoise3D();
canvas.width=window.innerWidth*.9;
canvas.height = window.innerHeight*.85;
let button = document.getElementById('button');


let width = (canvas.width );
let height = (canvas.height );

let scl =.01;



let count =1;
function render(a) {
    requestAnimationFrame(render);

    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='white';
    for (let x =0; x<609; x+=3)
    {
        for (let y = 0; y<600; y+=3)
        {
            let data =noise3D(x * scl, y * scl,count*scl);
            ctx.beginPath();


            ctx.arc(x,y,(data+1)/2,0,Math.PI*2);
            ctx.fill();

        }
    }
    count+=10;

}
render()