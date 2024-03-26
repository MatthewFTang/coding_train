import "../style.css";
// Import the necessary modules
const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;

        this.color = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
        ];
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}


function render() {
    // ctx.fillStyle = "#242424";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    requestAnimationFrame(render);

}
render();

