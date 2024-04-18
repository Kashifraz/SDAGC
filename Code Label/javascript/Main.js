import { Component } from "react";
import { ContentDisplay } from "../components/others/";
import { createRef } from "react";
import { FloppyBird, PipePair } from "./FloppyBird";

// Load Styles
const rootStyles = getComputedStyle(document.documentElement);
const darkFontColour = rootStyles.getPropertyValue("--lavender-pastel-font-1");
// const lightFontColour = rootStyles.getPropertyValue("--lavender-pastel-5");

// Load Images
const playerImage = new Image();
playerImage.src = "https://raw.githubusercontent.com/bryanluwz/gh-pages-common-public/main/images/Floppy-Bird-assets/totoco.png";

const bottomPipeImage = new Image();
bottomPipeImage.crossOrigin = "anonymous";
bottomPipeImage.src = "https://raw.githubusercontent.com/bryanluwz/gh-pages-common-public/main/images/Floppy-Bird-assets/pipe.png";

const topPipeImage = new Image();

bottomPipeImage.onload = function () {
	// Create a temporary canvas
	const tempCanvas = document.createElement('canvas');
	const tempContext = tempCanvas.getContext('2d');

	// Set the size of the temporary canvas to match the image dimensions
	tempCanvas.width = bottomPipeImage.width;
	tempCanvas.height = bottomPipeImage.height;

	// Rotate the image on the temporary canvas
	tempContext.translate(bottomPipeImage.width, bottomPipeImage.height);
	tempContext.rotate(Math.PI);
	tempContext.drawImage(bottomPipeImage, 0, 0);

	// Extract the rotated image data
	topPipeImage.src = tempCanvas.toDataURL();
};

// Main Component
export default class Main extends Component {
	constructor(props) {
		super(props);

		this.canvasRef = createRef();

		this.game = {
			player: null,
			pipes: [],
			score: 0
		};

		this.fps = 50;

		this.state = {
			playerSize: 80,
			canNewPipeBeAdded: true
		};

		this.gameOverMessages = [
			"game over",
			"birb is ded",
			"birb is kill",
			"rip birb"
		];
		this.gameOverMessage = "";

		setInterval(() => {
			this.frameUpdate();
		}, 1000 / this.fps);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);

		// Init game
		this.setState(this.handleResize, this.initGame);

		// What?? A warning?? I don't care
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	// Handle screen resize
	handleResize = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth * 1;
		canvas.height = window.innerHeight * 1;

		const playerSize = Math.max(100, Math.min(150, canvas.width * 0.05));

		this.setState({ playerSize });

		// Rerender code here
		const player = this.game.player;
		if (!player) return;
		player.updateCanvasSize(canvas.width, canvas.height);
		player.updatePlayerSize(playerSize);
		player.resetVelocity();
	};

	// Render
	frameUpdate = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		const context = this.canvasRef.current.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);		// this.renderBackground();

		this.updatePlayer();
		this.renderPlayer(context);

		if (this.game.player.isFlying) {
			this.updatePipesArray(canvas);
			if (!this.game.player.isDead) {
				this.updatePipes();
			}
			this.renderPipes(context);
		}

		this.renderScore(canvas, context);

		// Check if game is over
		if (this.game.player.isDead) {
			// Draw game over scene 
			// Draw game over text and score
			context.fillStyle = darkFontColour;
			context.font = "bold 3em Poppins";
			context.textAlign = "center";
			context.fillText(this.gameOverMessage, canvas.width / 2, canvas.height / 2 - 30);

			context.fillStyle = darkFontColour;
			context.font = "bold 1.5em Poppins";
			context.fillText(`You scored ${this.game.score} points`, canvas.width / 2, canvas.height / 2 + 10);
		}
		else if (this.game.player.isFlying) {
			this.checkIfPlayerCollideWithPipes();
		}
	};

	renderPlayer = (context) => {
		const player = this.game.player;

		// Draw using player.img
		context.drawImage(player.img, player.x, player.y, player.playerSize, player.playerSize);
	};

	updatePlayer = () => {
		const player = this.game.player;

		player.update();
	};

	renderPipes = (context) => {
		// Draw the pipes using pipes image
		const pipes = this.game.pipes;

		// Draw using players image
		context.fillStyle = "#000000";
		pipes.forEach(pipePair => {
			pipePair.pipes.forEach(pipe => {
				context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
			});
		}
		);
	};

	updatePipes = () => {
		// Update the pipes position
		const pipes = this.game.pipes;
		pipes.forEach(pipePair => {
			pipePair.update();
		}
		);
	};

	updatePipesArray = (canvas) => {
		// Adding new pipes in array if pipes are less than 3
		// Remove pipes from array if they are out of the left canvas
		// Pipes initial position are within a range of (x to y) from the player
		// Pipes come in pair, top and bottom
		// The distance between the top and bottom pipe are fixed (more or less)
		// The distance between the pipes are fixed (more or less)
		// The pipes would be moving from right to left towards the player at a fixed rate
		if (this.game.pipes.length < 5) {
			// Add new pipes in array, and have cooldown of 3 secs before new one is added
			if (!this.state.canNewPipeBeAdded) return;

			if (Math.random() < 0.3 || this.game.pipes.length === 0) {
				// Add new pipe when previous pipe is 300px away from right side of canvas
				// or when there is no pipe in the array
				if (this.game.pipes.some((pipePair) => {
					return pipePair.x + pipePair.width > canvas.width - 300;
				})) {
					return;
				}

				this.game.pipes.push(
					new PipePair(
						canvas.width,
						Math.floor(Math.random() * canvas.height / 2),
						100,
						canvas.height, {
						"top": topPipeImage,
						"bottom": bottomPipeImage
					},
						this.fps,
						canvas.height * 45 / 100)
				);
			}
		}

		// Check if player passed the pipe
		this.game.pipes.forEach(pipePair => {
			if (pipePair.pipes[0].x - pipePair.width < this.game.player.x + this.game.player.hitboxSize && !pipePair.isScored) {
				this.game.score++;
				pipePair.isScored = true;
			}
		});

		// Remove pipes that are out of the left canvas
		this.game.pipes.forEach(pipePair => {
			if (pipePair.checkOutOfCanvas()) {
				this.game.pipes.splice(this.game.pipes.indexOf(pipePair), 1);
			}
		});
	};

	// Render score on the top center of the screen 
	renderScore = (canvas, context) => {
		context.fillStyle = darkFontColour;
		context.font = "bold 1.5em Poppins";
		context.textAlign = "center";
		context.fillText(this.game.score, canvas.width / 2, 50);
	};


	// Check if player collide with pipes
	checkIfPlayerCollideWithPipes = () => {
		const player = this.game.player;
		const pipes = this.game.pipes;

		// generated by GitHub Copilot
		pipes.forEach(pipePair => {
			const [topPipe, bottomPipe] = pipePair.pipes;
			if ((player.x + player.hitboxSize) > topPipe.x && player.x < (topPipe.x + topPipe.width)) {
				if ((player.y + player.playerSize - player.hitboxSize) < (topPipe.y + topPipe.height) || (player.y + player.hitboxSize) > bottomPipe.y) {
					player.isDead = true;
				}
			}
		}
		);
	};

	// Reset game
	initGame = () => {
		const canvas = this.canvasRef.current;
		if (!canvas) return;

		// Create new player
		this.game.player = new FloppyBird(canvas.width, canvas.height, this.state.playerSize, this.fps, playerImage);

		// Init pipes
		this.setState({ canNewPipeBeAdded: true });
		this.gameOverMessage = this.gameOverMessages[Math.floor(Math.random() * this.gameOverMessages.length)];

		this.game.pipes = [];

		// Reset score
		this.game.score = 0;
	};

	resetGame = () => {
		this.game.player.resetPlayer();
		this.game.pipes = [];
		this.game.score = 0;
		this.gameOverMessage = this.gameOverMessages[Math.floor(Math.random() * this.gameOverMessages.length)];
	};

	// Check if space bar or click (touch / press) is pressed
	checkIfSpaceBarOrClick = (e) => {
		if (e.code === "Space" || e.type === "click") {
			if (this.game.player.isDead) {
				this.resetGame();
			}
			else {
				this.game.player.up();
			}
		}
	};

	render() {
		return (
			<ContentDisplay
				backButtonRedirect={"https://bryanluwz.github.io/#/fun-stuff"}
				displayName={Main.displayName}
				displayClearHistory={false}
				faIcon={"fa-trash"}
				contentBodyAdditionalClasses={["floppy-bird-content-body"]}
				router={this.props.router}
				handleHeaderTitleClick={() => { console.log("please do not play on mobile"); }}
			>
				<img src="https://raw.githubusercontent.com/bryanluwz/gh-pages-common-public/main/images/Floppy-Bird-assets/background.png" alt="background" />
				<canvas
					ref={this.canvasRef}
					className="floppy-bird-canvas"
					tabIndex={1000}
					onClick={this.checkIfSpaceBarOrClick}
					onKeyDownCapture={this.checkIfSpaceBarOrClick}
				>
				</canvas>
			</ContentDisplay>
		);
	}
}

Main.displayName = "Floppy Bird";
