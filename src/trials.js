window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

document.onselectstart = function() {
    return false;
};
const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
const dpr = window.devicePixelRatio;
const cw = window.innerWidth;
const ch = window.innerHeight;
c.width = cw * dpr;
c.height = ch * dpr;
ctx.scale(dpr, dpr);
const rand = function (rMi, rMa) {
    return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
};
ctx.lineCap = 'round';
let orbs = [];
const orbCount = 30;
let radius;

const trailCB = document.getElementById('trail');
let trail = trailCB.checked;
const clearer = document.getElementById('clear');

function createOrb(mx,my){
    const dx = (cw / 2) - mx;
    const dy = (ch / 2) - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    orbs.push({
        x: mx,
        y: my,
        lastX: mx,
        lastY: my,
        hue: 0,
        colorAngle: 0,
        angle: angle + Math.PI/2,
        //size: .5+dist/250,
        size: rand(1,3)/2,
        centerX: cw/2,
        centerY: ch/2,
        radius: dist,
        speed: (rand(5,10)/1000)*(dist/750)+.015,
        alpha: 1 - Math.abs(dist)/cw,
        draw: function() {
            ctx.strokeStyle = 'hsla('+this.colorAngle+',100%,50%,1)';
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        },
        update: function(){
            const mx = this.x;
            const my = this.y;
            this.lastX = this.x;
            this.lastY = this.y;
            const x1 = cw / 2;
            const y1 = ch / 2;
            const x2 = mx;
            const y2 = my;
            const rise = y1 - y2;
            const run = x1 - x2;
            const slope = -(rise / run);
            const radian = Math.atan(slope);
            let angleH = Math.floor(radian * (180 / Math.PI));
            if(x2 < x1 && y2 < y1){angleH += 180;}
            if(x2 < x1 && y2 > y1){angleH += 180;}
            if(x2 > x1 && y2 > y1){angleH += 360;}
            if(y2 < y1 && slope =='-Infinity'){angleH = 90;}
            if(y2 > y1 && slope =='Infinity'){angleH = 270;}
            if(x2 < x1 && slope =='0'){angleH = 180;}
            if(isNaN(angleH)){angleH = 0;}

            this.colorAngle = angleH;
            this.x = this.centerX + Math.sin(this.angle*-1) * this.radius;
            this.y = this.centerY + Math.cos(this.angle*-1) * this.radius;
            this.angle += this.speed;

        }
    });
}

function orbGo(e){
    const mx = e.pageX - c.offsetLeft;
    const my = e.pageY - c.offsetTop;
    createOrb(mx,my);
}

function turnOnMove(){
    c.addEventListener('mousemove', orbGo, false);
}

function turnOffMove(){
    c.removeEventListener('mousemove', orbGo, false);
}

function toggleTrails(){
    trail = trailCB.checked;
}

function clear(){
    orbs = [];
}

c.addEventListener('mousedown', orbGo, false);
c.addEventListener('mousedown', turnOnMove, false);
c.addEventListener('mouseup', turnOffMove, false);
trailCB.addEventListener('change', toggleTrails, false);
clearer.addEventListener('click', clear, false);

let count = 100;
while(count--){
    createOrb(cw/2, ch/2+(count*2));
}

const loop = function () {
    window.requestAnimFrame(loop);
    if (trail) {
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, cw, ch);
    } else {
        ctx.clearRect(0, 0, cw, ch);
    }
    let i = orbs.length;
    while (i--) {
        const orb = orbs[i];
        let updateCount = 3;
        while (updateCount--) {
            orb.update();
            orb.draw(ctx);
        }

    }
};

loop();
