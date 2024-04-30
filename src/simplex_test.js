import data from "/src/assets/colors.json";
const color_palette = data[0];
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


canvas.width=window.innerWidth*.9;
canvas.height = window.innerHeight*.8;

import {createNoise3D} from 'simplex-noise';


const scl =0.002;
const stepSize =20;
const maxSize =5;
let noise =createNoise3D();

for (let x =stepSize/2;  x<canvas.width-stepSize/2; x+=stepSize)
{
    for (let y= stepSize/2 ;y<canvas.height; y+=stepSize)
    {
        ctx.fillStyle='black'
        let dx = (1+noise(x*scl,y*scl,0))*maxSize;
        // console.log(dx)
        ctx.beginPath();

        ctx.arc(x,y,dx,0,Math.PI*2);
        ctx.fill();
    }
}