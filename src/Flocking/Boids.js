
class Boids {
    constructor() {

        this.position =  new p5.Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        this.velocity =  new p5.Vector(-2+(Math.random()*4),-2+Math.random()*4);
        this.acceleration =  new p5.Vector(0,0);
        this.r = 4;
        this.maxforce = .02;
        this.maxSpeed = 5;
        this.color = 'black';
        this.visualRange = 30;
    }

    render(ctx) {
        let angle = this.velocity.heading();
        ctx.save();
        ctx.beginPath();
        // ctx.translate()
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.fillStyle= this.color;

        ctx.lineTo(this.r * 2, 0);
        ctx.lineTo(-this.r * 2, -this.r);
        ctx.lineTo(-this.r * 2, this.r);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() {
        this.velocity.add(this.acceleration);
          this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        // check if out of bounds
        if (this.outBounds()) {
            if (this.position.x < 0) {
                this.position.x = canvas.width;
            }
            if (this.position.x > canvas.width) {
                this.position.x = 0;
            }
            if (this.position.y < 0) {
                this.position.y = canvas.height;
            }
            if (this.position.y > canvas.height) {
                this.position.y = 0;
            }
        }
    }

    separate_align_cohesion(flock) {
        let sumSeparate = new p5.Vector(0, 0);
        let sumAlign = new p5.Vector(0, 0);
        let sumCohesion = new p5.Vector(0, 0);
        let count = 0;

        for (let other of flock) {
            if (this !== other) {
                let distance = this.position.dist(other.position);
                if (distance < this.visualRange) {
                    // Separate
                    let diff = new p5.Vector(this.position);
                    diff.sub(other.position);
                    diff.div(distance);
                    sumSeparate.add(diff);
                    //align
                    sumAlign.add(other.velocity);
                    //cohesion
                    sumCohesion.add(other.position);
                    count++;
                }
            }
        }
        if (count > 0) {
            //separate
            sumSeparate.div(count);
            // let steer =  new p5.Vector.sub(sumSeparate,this.velocity);
            // steer.limit(this.maxforce);
            // this.applyForce(steer)
            this.steer(sumSeparate);

            // align
            sumAlign.div(count);
            this.steer(sumAlign);

            //cohesion
            sumCohesion.div(count);
            // sumCohesion.div(this.position);
            this.steer(sumCohesion);

        }
    }

    steer(target) {
        target.setMag(this.maxSpeed);

        let steer =  new p5.Vector.sub(target,this.velocity);
        steer.limit(this.maxforce);
        this.acceleration.add(steer);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    outBounds() {
        return (
            this.position.x < 0 ||
            this.position.x > canvas.width ||
            this.position.y < 0 ||
            this.position.y > canvas.height
        );
    }

    run(flock,ctx) {
        this.separate_align_cohesion(flock);
        this.update();
        this.render(ctx);
    }
}
export  {Boids};