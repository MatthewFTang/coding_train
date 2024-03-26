export class Circle {
  constructor() {
    this.radius = 30;
    this.create();
  }
  create() {
    this.v = Math.random() * 4 + 1;
    let x = this.radius + Math.random() * (canvas.width - this.radius * 2);
    let y =
      this.radius + Math.random() * (canvas.height- this.radius * 2);

    this.direction = Math.random() * Math.PI * 2;

    this.x = x;
    this.y = y;

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let a = 1;
    this.color = "rgba( " + r + "," + b + "," + g + "," + a + ")";
  }
  display(context) {
    this.draw(context);
    this.update();
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
  update() {
    let dx = this.v * Math.cos(this.direction);
    let dy = this.v * Math.sin(this.direction);
    this.x += dx;
    this.y += dy;
    if (this.bounds()) {
      // this.x = -this.x;
      this.direction += Math.PI;
      // this.y = -this.y;
    }
  }
  bounds() {
    return (
      this.x + this.radius > canvas.width ||
      this.x - this.radius < 0 ||
      this.y + this.radius > canvas.height ||
      this.y - this.radius < 0
    );
  }
}
