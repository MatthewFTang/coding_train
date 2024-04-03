import "../style.css";
var canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
import { createNoise3D } from 'simplex-noise';
canvas.width=window.innerWdth*.9;
canvas.height = window.innerHeight*.85;
let button = document.getElementById('button');
let noiseScale = document.getElementById('noiseScale')
let maxForce = document.getElementById('maxForce')

let width = (canvas.width );
let height = (canvas.height );

let scl=0.001;
noiseScale.oninput = function() {
    scl= this.value;
    newScene();
}
maxForce.oninput=function ()
{
    maxForce=this.value;
    newScene();
}


let noise3D;
function newScene()
{
     noise3D = createNoise3D();
ctx.clearRect(0,0,width,height);
}
class Particle {
    constructor() {
        // this.x = Math.random()*width;
        // this.y = Math.random()*height;
        this.position ={
            x: Math.random()*width,
            y :Math.random()*height
        }

        this.velocity ={
            x: 0,
            y :0
        }
        this.acceleration ={
            x: 0,
            y :0
        }
        this.previous =
            {
                x:this.position.x,
                y: this.position.y,
            };

        this.count = Math.random()*300;
        this.lifetime =0;
        this.maxForce = maxForce;
    }

    show() {

        if (this.count > 1) {
            // ctx.lineWidth = 1;

            ctx.beginPath();
            // ctx.moveTo(this.position.x,this.position.y)
             ctx.arc(this.position.x,this.position.y,.1,0,Math.PI*2)
            // ctx.lineTo(this.previous.x,this.previous.y)
            ctx.strokeStyle = "rgba(255,255,0,0.1)";

            ctx.stroke();
        }
        this.count++;
        this.previous.x =this.position.x;
        this.previous.y = this.position.y;
    }


    update() {
        this.velocity.x +=this.acceleration.x;
        this.velocity.y +=this.acceleration.y;
        this.position.x+=this.velocity.x;
        this.position.y +=this.velocity.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;

        if (!this.inBounds()) {

           this.wrap_position();
        }
        // this.lifetime++;
        if (this.count>300)
        {
            this.position.x=Math.random()*width;
            this.position.y =Math.random()*height;
            this.count=0;
        }


    }

    seek() {
        let angle =
            (noise3D(this.position.x * scl, this.position.y * scl,0)) * Math.PI*2 ;
        let x1 = this.position.x + Math.cos(angle);
        let y1 = this.position.y + Math.sin(angle);
        let desired_X  = x1-this.position.x;
        let desired_Y = y1-this.position.y;
        let steerX = desired_X-this.velocity.x;
        let steerY = desired_Y-this.velocity.y;
        steerX*=maxForce;
        steerY*=maxForce;
        this.acceleration.x +=steerX;
        this.acceleration.y +=steerY;
    }
    inBounds() {
        return (
            this.position.x > width ||
            this.position.x < -0 ||
            this.position.y > height ||
            this.position.y < 0
        );
    }
    wrap_position() {
        if (this.position.x > width) {
            this.position.x = 0;
        }
        if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        }
    }
    run()
    {
        this.seek();
        this.update();
        this.show();
    }
}



let particles = [];
const n_particles = 8000;
button.onclick = function StartAnimation()
{
    newScene();
}

function init()
{
    newScene()
    for (let i =0 ; i<n_particles; i++)
    {
        particles.push(new Particle())
    }
}

function render(a) {
    // ctx.clearRect(0,0,width,height);
    for (let i =0; i <particles.length; i++)
    {
        particles[i].run();
    }
    requestAnimationFrame(render);

}
init();
requestAnimationFrame(render);
