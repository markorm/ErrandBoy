/* ===== Engine: Game ===== */

namespace engine {

	export interface SceneConfig {
		name: string,
		run(): void
	}

	export interface Scene {
		name: string,
		run(): void,
	}

	export interface GameDescription {
		title: string
		description: string,
		author: string,
	}

	export interface GameConfig {
		debug: boolean,
		framerate: number,
		soundPath: string,
		musicPath: string,
	}

	// The core game engine
	export class Game {

		config: GameConfig;
		description: GameDescription;
		screen: HTMLElement;
		scene: Scene;
		scenes: Scene[];
		events: Events;
		audio: GameAudio;
		level: Level;
		player: Player;
		ui: UI;

		// Game Initialization
		constructor(config: GameConfig, description: GameDescription) {
			// Set Object Properties
			this.config = config;
			this.description = description;
			this.scenes = [];
			this.screen = document.getElementById("screen");
			this.audio = new GameAudio(this.config.soundPath, this.config.musicPath);
			this.level = new Level(this.screen);
			this.ui = new UI(this.screen, this.audio);
			this.events = new Events;
			this.player = new Player;
		}

		// Register a scene in the game object
		public RegisterScene(config: SceneConfig) {
			let scene: Scene = {
				name: config.name,
				run: config.run,
			};
			this.scenes.push(scene);
		}

		// Load a Scene
		public LoadScene(name: string) {
			let ok = false;
			// Look for a scene and run
			this.scenes.forEach((scene) => {
				if (scene.name === name) {
					this.scene = scene;
					this.screen.dataset.name = this.scene.name;
					this.scene.run();
					ok = true;
					return;
				}
			});
			if (!ok) {
				let error = new Error("Failed to find scene: " + name);
				this.Exit(error);
			}
		}

		// Kill the game loop
		public Exit(error: Error) {
			console.error(error);
			clearInterval(this.level.loop);
		}


	}

}
