fetch("./src/assets/colors.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error("Error loading JSON:", error);
	});

import SimplexNoise from "https://unpkg.com/simplex-noise@3.0.0/dist/esm/simplex-noise.js";

// import { SimplexNoise } from "three/examples/jsm/Addons.js";
const color_palette = data[0];
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// img.crossOrigin = "anonymous";
canvas.height = window.innerHeight * 0.8;
canvas.width = window.innerWidth * 0.9;
// import { createNoise3D, createNoise2D } from "simplex-noise";

const noise = SimplexNoise.createNoise2D();
// const noise2 = createNoise3D();

const steps = 1000000;
let current_x = Math.floor(canvas.width / 2);
let current_y = Math.floor(canvas.height / 2);
ctx.clearRect(0, 0, canvas.width, canvas.height);
const scl = 0.002;
ctx.strokeStyle = `rgba(0,0,0,0.1)`;
let currentStep = 0;

function flow_field() {
	for (let i = 0; i < steps; i++) {
		// let dir = Math.random()*Math.PI;/
		// let v = (3+noise(current_x*scl,current_y*scl,0))*40;
		// dir+=.02;
		let dir = noise(current_x * scl, current_y * scl) * Math.PI;
		// let colorAngle = noise2(current_x*scl*.1,current_y*scl*.1,0)*Math.PI*2;
		// ctx.strokeStyle=`hsl(${colorAngle*180/Math.PI},75%,50%)`;
		let v = 5;
		let dx = v * Math.cos(dir);
		let dy = v * Math.sin(dir);
		let next_x = current_x + dx;
		let next_y = current_y + dy;
		if (
			current_x < 0 ||
			current_x >= canvas.width ||
			current_y < 0 ||
			current_y >= canvas.height ||
			currentStep > 300
		) {
			next_x = Math.random() * canvas.width;
			next_y = Math.random() * canvas.height;
			current_y = next_y;
			current_x = next_x;
			currentStep = 0;
			// dir+=Math.PI/24;
		}
		currentStep++;
		ctx.beginPath();
		ctx.moveTo(current_x, current_y);
		// ctx.arc(current_x,current_y,3,0,Math.PI*2);
		ctx.lineTo(next_x, next_y);
		ctx.stroke();
		ctx.lineWidth = 1;
		current_x = next_x;
		current_y = next_y;
	}
}
flow_field();
//
// img.onload = function() {
//     canvas.width=this.width;
//     canvas.height=this.height;
//     ctx.drawImage(this,0,0)
//     // for (let i =0; i<img.data)
//     //
//     const imageData = ctx.getImageData(0, 0, this.width, this.height); // get the image array
//     let blank=[]
//     let max =0;
//     for  (let i =0; i<imageData.data.length;i+=4)
//     {
//         let sum =0 ;
//         sum+= imageData.data[i]+imageData.data[i+1]+imageData.data[i+2];
//         blank.push(sum);
//         if (sum>max)
//         {
//             max=sum;
//         }
//     }
//     const steps=1000;
//     let current_x = Math.floor(this.width/2)
//     let current_y = Math.floor(this.height/2);
//     ctx.clearRect(0,0,this.width,this.height);
//     ctx.strokeStyle='black';
//     for (let i=0; i<steps; i++)
//     {
//         let dir = Math.random()*Math.PI;
//         let idx = current_x+current_y*this.width;
//         let v =(blank[idx]/max)*20;
//         console.log(v);
//         let dx = v * Math.cos(dir);
//         let dy = v * Math.sin(dir);
//         let next_x = Math.floor(current_x+dx);
//         let next_y = Math.floor(current_y+dy)
//         if (next_x<0 || next_x>=this.width || next_y<0 || next_y>=this.height)
//         {
//             break;
//         }
//         ctx.beginPath();
//         ctx.moveTo(current_x, current_y);
//         ctx.lineTo(next_x, next_y);
//         ctx.stroke();
//         ctx.lineWidth=1;
//         current_x= next_x;
//         current_y= next_y;
//     }
//
// }
//
// // img.
