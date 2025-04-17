(async function initialize() {
	// Fetch colors.json dynamically
	async function loadColors() {
		try {
			const response = await fetch("../src/assets/colors.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log("Loaded color palette:", data);
			return data; // Return the loaded JSON data
		} catch (error) {
			console.error("Error loading colors.json:", error);
			return null; // Return null if an error occurs
		}
	}

	// Load colors.json at the start
	const colorData = await loadColors();
	if (!colorData) {
		console.error("Failed to load colors.json. Exiting script.");
		return; // Exit if the data couldn't be loaded
	}

	// Assign the loaded data to variables
	let color_palette = colorData[0]; // Access the first object in the JSON
	let colors = color_palette["4"]; // Default color palette
	let attempts = 0;

	// Canvas setup
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight * 0.8;
	const ww = canvas.width;
	const wh = canvas.height;

	// Button setup
	const button = document.getElementById("start");
	button.onclick = function () {
		let col = Math.floor(Math.random() * Object.keys(color_palette).length);
		colors = color_palette[col];
		makeAndDisplay();
	};

	// Particle class definition
	class Particle {
		constructor(x, y, colors) {
			this.x = x;
			this.y = y;

			this.r = 0;
			this.color = colors[Math.floor(Math.random() * colors.length)];
			this.growing = true;
			this.growCount = 0;
		}

		render() {
			if (this.growCount > 1) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		grow(particles) {
			if (this.growing) {
				this.growing = !this.edge();
				this.overlapping(particles);
				if (this.growing) {
					this.r += 1;
					this.growCount++;
				}
			}
		}

		edge() {
			return (
				this.x + this.r > ww ||
				this.y + this.r > wh ||
				this.x - this.r < 0 ||
				this.y - this.r < 0
			);
		}

		overlapping(particles) {
			for (let p of particles) {
				if (p !== this) {
					let dist = Math.sqrt(
						(this.x - p.x) * (this.x - p.x) +
							(this.y - p.y) * (this.y - p.y)
					);
					if (dist < this.r + p.r) {
						this.growing = false;
						p.growing = false;
						attempts++;
						break;
					}
				}
			}
		}
	}

	// Function to create and display particles
	function makeAndDisplay() {
		attempts = 0;
		let particles = [];

		while (attempts < 20000) {
			let x = Math.random() * ww;
			let y = Math.random() * wh;
			particles.push(new Particle(x, y, colors));
			for (let i = 0; i < particles.length; i++) {
				particles[i].grow(particles);
			}
		}
		ctx.fillStyle = "black";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < particles.length; i++) {
			particles[i].render();
		}
	}

	// Start the script by drawing the initial image
	makeAndDisplay();
})();
