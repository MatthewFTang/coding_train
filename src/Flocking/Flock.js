class Flock{
    constructor(){
        this.boids =[];
    }

    run(){
        let oldFlock = [...this.boids];
        
        for (let boid of oldFlock)
        {
            boid.run(oldFlock);
        }

        text(floor(frameRate()), 10, 10);
    }
    add(boid)
    {
        this.boids.push(boid);
    }

}