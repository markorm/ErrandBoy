/* ===== Engine: User Interface ===== */

namespace engine {

	// UI Element Class
	class UIElement {

		screen: HTMLElement;
		element: HTMLElement;
		animate: engine.Animate;

		// Setup for the new UIElement
		constructor(template:string, screen:HTMLElement) {

			this.screen = screen;
			this.animate = new Animate;

			// Build an HTML Element from the template string
			let wrap = document.createElement("div");
			wrap.innerHTML = template;
			this.element = <HTMLElement>wrap.firstChild;
			this.element.classList.add("ui-element");
			this.screen.appendChild(this.element);

			// Call the core init methods
			this.BindEvents();
			this.ManageConditions();
		}

		// Look for all onevetns in the element
		// add event listeners for the onevents
		// dispatch the doevents
		private BindEvents() {
			let elements = this.element.querySelectorAll("[data-onevent]");
			elements.forEach((el:HTMLElement) => {
				el.addEventListener(el.dataset.onevent, () => {
					let event = new Event(el.dataset.doevent);
					window.dispatchEvent(event);
				});
			});
		}

		// look for all the if confitions
		// Check property on the game object
		// Disable if property is false
		private ManageConditions() {
			let elements = this.element.querySelectorAll("[data-if]");
			elements.forEach((el:HTMLElement) => {
				let condition = el.dataset.if;
				let property = game[condition];
				if (!property) { el.classList.add("disabled"); }
			});
		}

		// Remove the element
		public Remove() {
			this.screen.removeChild(this.element);
		}

		// Fade in the element
		public FadeOut(duration:number) {
			return new Promise((resolve) => {
				this.animate.FadeOut(this.element, duration).then(resolve);
			});
		}

		// Fade out the element
		public FadeIn(duration:number) {
			return new Promise((resolve) => {
				this.animate.FadeIn(this.element, duration).then(resolve);
			});
		}

	}

	// Base User Interface Class
    export class UI {

    	audio: GameAudio;
        screen: HTMLElement;

        // UI Setup
        constructor(screen:HTMLElement, audio:engine.GameAudio) {
	        this.audio = audio;
        	this.screen = screen;
        }

        // Set a background image
        public Background(filename:string) {
            this.screen.style.background = `url(assets/images/${filename}) center center no-repeat`;
        }

        // Create a UI element from a template
	    public CreateElement(template:string) : UIElement {
        	let element = new UIElement(template, this.screen);
        }

        // Draw a new element on the screen
        // Register dialog events
        public DrawDialog(template:string) {
            return new Promise((resolve) => {
	            let wrap = document.createElement("div");
	            wrap.innerHTML = template;
	            let dialog = <HTMLElement>wrap.firstChild;
	            dialog.classList.add("ui-dialog");
	            this.screen.appendChild(dialog);
	            this.ParseDialog(dialog).then(() => {
		            resolve(dialog);
	            });
            });
        }

        // Remove a dialog
	    public RemoveDialog(dialog:HTMLElement) {
        	this.screen.removeChild(dialog);
	    }

        // Register the events bound to the dialog we just loaded.
        // Dialog Events only fire once and are immediately removed
        public ParseDialog(src:HTMLElement) {
            return new Promise((resolve) => {
                let elements = src.querySelectorAll("*");
                elements.forEach((el:HTMLElement) => {
	                // Register Dialog Events
                    if (el.dataset.onevent
                        &&el.dataset.doevent) {
	                    el.addEventListener(el.dataset.onevent, () => {
		                    let event = new Event(el.dataset.doevent);
		                    window.dispatchEvent(event);
	                    });
                    }
                    // Check dialog conditions
                    if (el.dataset.if) {
                    	let condition = el.dataset.if;
						let property = game[condition];
						if (!property) {
							el.classList.add("disabled");
						}
                    }
                    // Bind buttons to play the click sound
	                if (el.tagName === "button") {
                    	console.log("is button");
                    	el.addEventListener("click", () => {
                    		console.log("button clicked");
							this.audio.PlaySound("click.mp3");
	                    });
	                }
	                resolve();
                });
            });
        }

    }

}