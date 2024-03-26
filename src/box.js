class Box {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h);
    World.add(world, this.body);
    // this.ctx = ctx;
  }
  draw() {
    ctx.beginPath();
    ctx.rotate(this.body.angle);
    ctx.fillStyle = "white";
    ctx.rect(
      this.body.position.x - this.w,
      this.body.position.y - this.h,
      this.w,
      this.h
    );
    ctx.fill();
  }
}
