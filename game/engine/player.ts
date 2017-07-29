/* ===== Engine: Player ===== */

namespace engine {

	export class Player {

		name: string;
		level: number;
		health: number;
		energy: number;
		local: boolean;
		currentScene: string;

		constructor() {
			// Check that a local player exists
			this.CheckLocal();
		}

		private CheckLocal() {
			this.local = false;
		}

		public New(data:HTMLElement) {
			let nameField = <HTMLInputElement>data.querySelectorAll('[data-player="name"]')[0];
			this.name = nameField.value;
			this.level = 1;
			this.health = 100;
			this.energy = 100;
			this.Save();
		}

		// Save the player object to local storage
		public Save() {
		}

		// Load the player from local storage
		public Load() {
			this.local = true;
		}

	}

}