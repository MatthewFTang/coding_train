class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(x,y,z) {
        if (x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }
        if (Array.isArray(x)) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            this.z += x[2] || 0;
            return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;

    }

    sub(x,y,z) {
        if (x instanceof Vector) {
            this.x -= x.x || 0;
            this.y -= x.y || 0;
            this.z -= x.z || 0;
            return this;
        }
        if (Array.isArray(x)) {
            this.x -= x[0] || 0;
            this.y -= x[1] || 0;
            this.z -= x[2] || 0;
            return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    }

    mag() {
      return Math.sqrt(this.x *this.x + this.y*this.y + this.z *this.z);
    }

    setMag(val) {
        let mag = this.mag();
        this.mult(1/mag);
        this.mult(val)
    }

    mult(x,y,z) {
        if (x instanceof Vector) {
            this.x *= x.x || 0;
            this.y *= x.y || 0;
            this.z *= x.z || 0;
            return this;
        }
        if (Array.isArray(x)) {
            this.x *= x[0] || 0;
            this.y *= x[1] || 0;
            this.z *= x[2] || 0;
            return this;
        }
        this.x *= x || 0;
        this.y *= y || 0;
        this.z *= z || 0;
        return this;
    }

    div(x,y,z) {
        if (x instanceof Vector) {
            this.x /= x.x || 0;
            this.y /= x.y || 0;
            this.z /= x.z || 0;
            return this;
        }
        if (Array.isArray(x)) {
            this.x /= x[0] || 0;
            this.y /= x[1] || 0;
            this.z /= x[2] || 0;
            return this;
        }
        this.x /= x || 0;
        this.y /= y || 0;
        this.z /= z || 0;
        return this;
    }

    heading() {
      return Math.atan2(this.y,this.x);
    }
    distanceSq(other)
    {
        return (((this.x  -other.x )*(this.x  -other.x )) + ((this.y  -other.y )*(this.y  -other.y )));
    }
    limit(max) {
        const mSq = this.mag();
        if (mSq > max * max) {
            this.div(mSq) //normalize it
                .mult(max);
        }
        return this;
    }
}

class Boids {
    constructor() {
        this.position =  new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        this.velocity =  new Vector(-2+(Math.random()*4),-2+Math.random()*4);
        this.acceleration =  new Vector(0,0);
        this.r = 4;
        this.maxforce = .002;
        this.maxSpeed = 10;
        this.color = 'white';

        this.visualRange = 15;
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
        // if (this.velocity.mag() < 3) {
        //     this.velocity.setMag(this.maxSpeed / 2);
        // }
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
        let sumSeparate = new Vector(0, 0);
        let sumAlign = new Vector(0, 0);
        let sumCohesion = new Vector(0, 0);
        let count = 0;

        for (let other of flock) {
            if (this !== other) {
                let distance = this.position.distanceSq(other.position);
                if (distance < this.visualRange*this.visualRange) {
                    // Separate
                    let diff = new Vector(this.position);
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
            let steerSeparate = this.steer(sumSeparate);

            // align
            sumAlign.div(count);
            let steerAlign = this.steer(sumAlign);

            //cohesion
            sumCohesion.div(count);
            sumCohesion.sub(this.position);
            let steerCohesion = this.steer(sumCohesion);

            // this.applyForce(steerSeparate);
            // this.applyForce(steerAlign);
            this.applyForce(steerCohesion);
        }
    }

    steer(target) {
        target.setMag(this.maxSpeed);
        let steer = new Vector(target);
        steer.sub(this.velocity);
        // return steer;
        return steer.limit(this.maxforce);
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