// import * as THREE from "three";

/**
 * CubeWave class creates a 3D wave animation using cubes.
 * The cubes are arranged in a grid, and their heights oscillate
 * in a wave pattern based on their distance from the center.
 */
class CubeWave {
	constructor() {
		// Initialize the scene, camera, and renderer
		this.init();

		// Create the grid of cubes
		this.box();

		// Start the animation loop
		this.animate();
	}

	/**
	 * Initializes the 3D scene, camera, and renderer.
	 * Sets up lighting and other scene properties.
	 */
	init() {
		this.scene = new THREE.Scene();

		// Create an orthographic camera for a flat projection
		this.camera = new THREE.OrthographicCamera(
			50 / -2,
			50 / 2,
			50 / 2,
			50 / -2,
			-100,
			100
		);

		// Position and rotate the camera
		this.camera.position.set(0, -5, 0);
		this.camera.rotation.set(-Math.PI / 4, -0.2, -0.3);
		this.scene.add(this.camera);

		// Initialize the wave counter
		this.count = 0;

		// Create a WebGL renderer and attach it to the canvas
		const canvas = document.getElementById("canvas");
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			canvas: canvas,
		});

		// Set the renderer size to fit the window
		this.renderer.setSize(
			window.innerWidth * 0.9,
			window.innerHeight * 0.8
		);

		// Add directional light to the scene
		this.light = new THREE.DirectionalLight(0xffffff, 2);
		this.light.position.set(0, 500, 2000);
		this.scene.add(this.light);

		// Add ambient light for softer shadows
		this.scene.add(new THREE.AmbientLight(0xcccccc));

		// Define a set of colors (currently unused)
		this.colors = ["#a20e0e", "#d8580b", "#f6d354", "#4882b7", "#814a66"];
		this.colors = ["#a20e0e"];
	}

	/**
	 * Animation loop that updates the wave effect and renders the scene.
	 * The height of each cube oscillates based on a sine wave.
	 */
	animate() {
		// Request the next frame of the animation
		requestAnimationFrame(() => this.animate());

		// Update the scale of each cube based on its distance from the center
		for (let i = 0; i < this.boxes.length; i++) {
			const object = this.boxes[i];
			const distanceFactor = this.distances[i];

			// Calculate the wave scale using a sine function
			const scale =
				Math.sin((this.count - distanceFactor * 0.5) / 24) * 25;

			// Apply the calculated scale to the cube
			object.scale.set(1, scale, 1);
		}

		// Increment the wave counter
		this.count += 1;

		// Render the scene
		this.renderer.render(this.scene, this.camera);
	}

	/**
	 * Creates a grid of cubes and calculates their distances from the center.
	 * Each cube is assigned a color based on its position.
	 */
	box() {
		// Size of each cube
		let size = 0.8;

		// Create a box geometry for the cubes
		const geometry = new THREE.BoxGeometry(size, size, size);

		// Arrays to store cube objects and their distances from the center
		this.distances = [];
		this.boxes = [];

		// Size of the grid
		let maxSize = 30;

		// Calculate the center of the grid
		const centerX = maxSize / 2;
		const centerZ = maxSize / 2;

		// Loop through the grid and create cubes
		for (let x = 0; x < maxSize; x++) {
			for (let z = 0; z < maxSize; z++) {
				// Calculate the squared distance from the center
				let dist = Math.pow(x - centerX, 2) + Math.pow(z - centerZ, 2);

				// Convert grid coordinates to LAB color space
				let x1 = (x / maxSize) * 255 - 127;
				let z1 = (z / maxSize) * 255 - 127;
				let rgb = lab2rgb([65, x1, z1]);

				// Create a cube with a color based on its position
				const object = new THREE.Mesh(
					geometry,
					new THREE.MeshLambertMaterial({
						color: (this.color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`),
					})
				);

				// Store the distance for wave calculations
				this.distances.push(dist);

				// Position the cube in the grid
				object.position.x = x - maxSize / 2;
				object.position.y = -6;
				object.position.z = z - maxSize / 2;

				// Add the cube to the scene and the boxes array
				this.boxes.push(object);
				this.scene.add(object);
			}
		}
	}
}

// Create an instance of the CubeWave class to start the animation
const cubeWave = new CubeWave();

/**
 * Converts LAB color values to RGB.
 * @param {Array} lab - An array containing LAB color values [L, A, B].
 * @returns {Array} An array containing RGB color values [R, G, B].
 */
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
