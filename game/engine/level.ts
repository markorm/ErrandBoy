/* ===== Engine: Canvas ===== */

namespace engine {

	export class Level {

		screen: HTMLElement;
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		loop: any;

		constructor(screen:HTMLElement) {
			this.screen = screen;
			this.canvas = document.createElement("canvas");
			this.canvas.id = "level";
			this.ctx = this.canvas.getContext("2d");
			this.screen.appendChild(this.canvas);
		}

		// Fire up the game loop
		// Execute all the callbacks in the queue
		// Exists the game on error
		public Start() {
			return new Promise((resolve) => {
				let interval = 1000 / game.config.framerate;
				this.loop = setInterval(() => {
				}, interval);
				resolve();
			});
		}

	}

}