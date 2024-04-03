import * as THREE from "three";

class CubeWave {
  constructor() {
    this.init();
    this.box();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      50 / -2,
      50 / 2,
      50 / 2,
      50 / -2,
      -100,
      1000
    );
    // this.camera = new THREE.PerspectiveCamera( 400, .1, .10, 1000 );
    this.scene.add(this.camera);

    this.count = 0;
    this.camera.position.set(0, -5,0);
    this.camera.rotation.set(-Math.PI / 4, -0.2, -0.3);

    // Create a renderer
    const canvas = document.getElementById('canvas');

    this.renderer = new THREE.WebGLRenderer({ alpha: true ,canvas:canvas});

    this.renderer.setSize(window.innerWidth*.9, window.innerHeight*.9);
    // this.renderer.setSize(canvas.width,canvas.height)
    // this.lighting = new THREE.AmbientLight(0xcccccc);
    // this.scene.add(this.lighting)
    this.light = new THREE.DirectionalLight(0xffffff, 2);
    this.light.position.set(0, 500, 2000);
    this.scene.add(this.light);

    this.scene.add(new THREE.AmbientLight(0xcccccc));
    this.colors = ["#a20e0e", "#d8580b", "#f6d354", "#4882b7", "#814a66"];
    this.colors = ["#a20e0e"];
  }
  animate() {
    requestAnimationFrame(() => this.animate());

    for (let i = 0; i < this.boxes.length; i++) {
      const object = this.boxes[i];

      const scale = Math.sin((this.count + this.distances[i] * 4) / 50) * 35;
      object.scale.set(1, scale, 1);
    }
    this.count -= 1;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  box() {
    let size = 0.8;
    const geometry = new THREE.BoxGeometry(size, size, size);
    this.distances = [];
    this.boxes = [];
    let maxSize = 30;

    for (let x = 0; x < maxSize; x++) {
      for (let z = 0; z < maxSize; z++) {
        let dist = (x * x + z * z) / maxSize;
        let x1 = ((x/maxSize)*255)-127 ;
        let z1 = ((z/maxSize)*255)-127;
        let rgb = lab2rgb([65,x1,z1])
        // let rgb = this.colors[Math.floor(Math.random() * this.colors.length)]
        const object = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial({
            color: (this.color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`),
            // color : rgb
          })
        );

        this.distances.push(dist);

        object.position.x = x - maxSize / 2;
        object.position.y = -6;
        object.position.z = z - maxSize / 2;
        this.boxes.push(object);
        this.scene.add(object);
      }
    }
  }
}

// Create an instance of the CubeWave class
const cubeWave = new CubeWave();

function lab2rgb(lab) {
  var y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200,
    r,
    g,
    b;

  x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
  y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
  z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);

  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return [
    Math.round(Math.max(0, Math.min(1, r)) * 255),
    Math.round(Math.max(0, Math.min(1, g)) * 255),
    Math.round(Math.max(0, Math.min(1, b)) * 255),
  ];
}
