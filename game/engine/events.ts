/* ===== Engine: Events ===== */

namespace engine {

    export interface Listener {
        name: string,
        handler: EventHandler,
    }

    export interface EventHandler {
        (any): void
    }

    export class Events {

        events: string[];
        inputs: {};
        listeners: Listener[];

        // Create our event, input and listeners
        // Call the method to get user input events
        constructor() {
            this.events = [];
            this.inputs = {};
            this.listeners = [];
            this.GetUserInput();
        }

        // Translates javascript keypress and click events into a format
        // for use in the game event que and following naming conventions
        private GetUserInput() {
            window.addEventListener('keydown', (e) => {
                this.inputs["game:keypress"] = true;
                this.inputs["game:key:" + e.keyCode] = true;
            },true);
            window.addEventListener('keyup', (e) => {
                this.inputs["game:keypress"] = false;
                this.inputs["game:key:" + e.keyCode] = false;
            },true);
            window.addEventListener('mousedown', (e) => {
                this.inputs["game:click"] = true;
                this.inputs["game:click:" + e.button] = true;
            },true);
            window.addEventListener('mouseup', (e) => {
                this.inputs["game:click"] = false;
                this.inputs["game:click:" + e.button] = false;
            },true);
        };

        // Provides binding to both javascript and game events.
	    // Creates an event listener for the callee that executes it's...
	    // ...event handler callback
        public Always(event:string, handler:EventHandler) {
        	window.addEventListener(event, (e) => {
		        e.preventDefault();
        		handler(e);
	        });
        }

        // Same as above, but remove the listener
	    public On(event:string, handler:EventHandler) {
        	let listener = (e) => {
        		e.preventDefault();
		        window.removeEventListener(event, listener);
		        handler(e);
	        };
		    window.addEventListener(event, listener);
	    }

    }

}