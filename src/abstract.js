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
	let colors; // Will hold the current color palette
	let which_col = Math.floor(
		Math.random() * Object.keys(color_palette).length
	); // Random index for color selection
	let blurFactor = 4; // Default blur factor

	// Canvas setup
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight * 0.7;

	const remakeButton = document.getElementById("start");
	const blurSlider = document.getElementById("BlurSlider");

	const n_boxes = 150;

	// Box class definition
	class Box {
		constructor() {
			this.x = -100 + Math.random() * canvas.width;
			this.y = -100 + Math.random() * canvas.height;
			this.w = 20 + Math.random() * 300;
			this.h = 20 + Math.random() * 300;
			let hexColor = colors[Math.floor(Math.random() * colors.length)];
			let c = hex2rgb(hexColor);
			this.color = `rgba(${c.r},${c.g},${c.b},1)`;
		}

		display() {
			if (Math.random() > 0.5) {
				ctx.globalCompositeOperation = "hard-light";
			} else {
				ctx.globalCompositeOperation = "darken";
			}
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}

	// Convert hex color to RGB
	const hex2rgb = (hex) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b };
	};

	// Create pixel noise effect
	function createPixelNoise() {
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < imageData.data.length; i += 4) {
			// Modify pixel data
			if (Math.random() > 0.5) {
				imageData.data[i] += 4; // Red
				imageData.data[i + 1] += 4; // Green
				imageData.data[i + 2] += 4; // Blue
			} else {
				imageData.data[i] -= 4;
				imageData.data[i + 1] -= 4;
				imageData.data[i + 2] -= 4;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	}

	// Apply blur effect
	function applyBlur() {
		const blurredRect = {
			x: 0,
			y: 0,
			width: canvas.width,
			height: canvas.height,
			spread: blurFactor,
		};
		ctx.filter = "blur(" + blurredRect.spread + "px)";
		ctx.drawImage(
			canvas,
			blurredRect.x,
			blurredRect.y,
			blurredRect.width,
			blurredRect.height,
			blurredRect.x,
			blurredRect.y,
			blurredRect.width,
			blurredRect.height
		);
		createPixelNoise();
	}

	// Draw the image
	function drawImage() {
		if (!color_palette) {
			console.error("Color palette is not loaded!");
			return;
		}

		console.log("Using color palette:", color_palette);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		applyBlur();

		colors = color_palette[which_col];
		for (let i = 0; i < n_boxes; i++) {
			let box = new Box();
			box.display(ctx);
		}
	}

	// Event listeners
	remakeButton.onclick = function () {
		which_col = Math.floor(
			Math.random() * Object.keys(color_palette).length
		);
		drawImage();
	};

	blurSlider.oninput = function () {
		blurFactor = this.value;
		drawImage();
	};

	// Start the script by drawing the initial image
	drawImage();
})();
