/* Intro Scene */
let intro = {};
let __intro = () => { intro.showTitle(); };
// Show the title screen
intro.showTitle = () => {
    // Play the intro music and draw the background
    audio.PlayMusic("tea-garden.mp3");
    ui.Background("intro-splash.jpg");
    // Fade in the screen, then show the titlecard.
    // The titlecard has an onevent attribute that will listen for the specified
    // ...event and then execute callbacks for all listeners
    ui.animate.FadeIn(ui.screen, 4000).then(() => {
        let introCard = `<div id="introCard">
	          <div class="title">${game.description.title}</div>
	          <div class="prompt">Press any key to Continue...</div>
	    </div>`;
        // // Draw the Dialog and listen for a keypress
        // ui.DrawDialog(introCard).then(($introCard:HTMLElement) => {
        // 	ui.animate.FadeIn($introCard, 1000).then();
        // 	events.On("keypress", () => {
        // 		audio.PlaySound("Accept.mp3");
        // 		ui.animate.FadeOut($introCard, 1000).then(() => {
        // 			ui.RemoveDialog($introCard);
        // 			intro.playerSelection();
        // 		});
        // 	});
        // });
    });
};
// Show the player selection screen
// The load player option is contingent upon a local player...
// being found, this is defined with the data-if query
intro.playerSelection = () => {
    // Listen to the game start event
    // Show the player selection dialog
    let playerSelection = `<div id="playerSelection" class="selection">
		<div class="title">${game.description.title}</div>
		<button class="positive"
			data-onevent="click"
			data-doevent="new-player">
			New Game
		</button>
		<button class="positive"
			data-if="player.local"
			data-onevent="click"
			data-doevent="load-player">
			Load Game
		</button>
	</div>`;
    // Show the player selection screen and listen for triggered events
    ui.DrawDialog(playerSelection).then(($playerSelection) => {
        ui.animate.FadeIn($playerSelection, 1000).then();
        // New Player Selection
        events.On("new-player", (e) => {
            ui.animate.FadeOut($playerSelection, 1000).then(() => {
                ui.RemoveDialog($playerSelection);
                intro.createCharacter();
            });
        });
        // Load Player Selection
        events.On("load-player", (e) => {
            player.Load();
            game.LoadScene(player.currentScene);
        });
    });
};
// Create a new character
intro.createCharacter = () => {
    let newCharacter = `<div id="character-creator" class="game-form" >
		<div class="form-title">Create a new character</div>
		<input data-player="name" autocomplete="false"/>
		<button data-onevent="click" data-doevent="create-character">Create Character</button>
	</div>`;
    ui.DrawDialog(newCharacter).then(($newCharacter) => {
        ui.animate.FadeIn($newCharacter, 1000).then();
        events.On("create-character", () => {
            player.New($newCharacter);
            ui.animate.FadeOut($newCharacter, 1000).then(() => {
                ui.RemoveDialog($newCharacter);
                intro.backStory();
            });
        });
    });
};
// Show Backstory
intro.backStory = () => {
};
/* ===== Engine: Events ===== */
var engine;
(function (engine) {
    class Events {
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
        GetUserInput() {
            window.addEventListener('keydown', (e) => {
                this.inputs["game:keypress"] = true;
                this.inputs["game:key:" + e.keyCode] = true;
            }, true);
            window.addEventListener('keyup', (e) => {
                this.inputs["game:keypress"] = false;
                this.inputs["game:key:" + e.keyCode] = false;
            }, true);
            window.addEventListener('mousedown', (e) => {
                this.inputs["game:click"] = true;
                this.inputs["game:click:" + e.button] = true;
            }, true);
            window.addEventListener('mouseup', (e) => {
                this.inputs["game:click"] = false;
                this.inputs["game:click:" + e.button] = false;
            }, true);
        }
        ;
        // Provides binding to both javascript and game events.
        // Creates an event listener for the callee that executes it's...
        // ...event handler callback
        Always(event, handler) {
            window.addEventListener(event, (e) => {
                e.preventDefault();
                handler(e);
            });
        }
        // Same as above, but remove the listener
        On(event, handler) {
            let listener = (e) => {
                e.preventDefault();
                window.removeEventListener(event, listener);
                handler(e);
            };
            window.addEventListener(event, listener);
        }
    }
    engine.Events = Events;
})(engine || (engine = {}));
/* ===== Engine: Animate ===== */
var engine;
(function (engine) {
    class Animate {
        // Fade In an element over a duration
        // @param el: the element to fade
        // @param duration: the length of the transition in ms
        FadeIn(el, duration) {
            return new Promise((resolve) => {
                el.classList.remove("disabled");
                let opacity = 0;
                let elOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue("opacity"));
                let dif = (1 - opacity) / duration;
                let fade = setInterval(() => {
                    if (opacity >= 1) {
                        clearInterval(fade);
                        resolve();
                    }
                    opacity += dif * 10;
                    if (elOpacity <= opacity) {
                        el.style.opacity = opacity.toString();
                    }
                }, 10);
            });
        }
        // Fade out an element over a duration
        // @param el: the element to fade
        // @param duration: the length of the transition in ms
        FadeOut(el, duration) {
            return new Promise((resolve) => {
                el.classList.add("disabled");
                let opacity = 1;
                let elOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue("opacity"));
                let dif = 1 / duration;
                let fade = setInterval(() => {
                    if (opacity <= 0) {
                        clearInterval(fade);
                        resolve();
                    }
                    opacity -= dif * 10;
                    if (elOpacity >= opacity) {
                        el.style.opacity = opacity.toString();
                    }
                }, 10);
            });
        }
    }
    engine.Animate = Animate;
})(engine || (engine = {}));
/* ===== Engine: User Interface ===== */
var engine;
(function (engine) {
    // UI Element Class
    class UIElement {
        // Setup for the new UIElement
        constructor(template, screen) {
            this.screen = screen;
            this.animate = new engine.Animate;
            // Build an HTML Element from the template string
            let wrap = document.createElement("div");
            wrap.innerHTML = template;
            this.element = wrap.firstChild;
            this.element.classList.add("ui-element");
            this.screen.appendChild(this.element);
            // Call the core init methods
            this.BindEvents();
            this.ManageConditions();
        }
        // Look for all onevetns in the element
        // add event listeners for the onevents
        // dispatch the doevents
        BindEvents() {
            let elements = this.element.querySelectorAll("[data-onevent]");
            elements.forEach((el) => {
                el.addEventListener(el.dataset.onevent, () => {
                    let event = new Event(el.dataset.doevent);
                    window.dispatchEvent(event);
                });
            });
        }
        // look for all the if confitions
        // Check property on the game object
        // Disable if property is false
        ManageConditions() {
            let elements = this.element.querySelectorAll("[data-if]");
            elements.forEach((el) => {
                let condition = el.dataset.if;
                let property = game[condition];
                if (!property) {
                    el.classList.add("disabled");
                }
            });
        }
        // Remove the element
        Remove() {
            this.screen.removeChild(this.element);
        }
        // Fade in the element
        FadeOut(duration) {
            return new Promise((resolve) => {
                this.animate.FadeOut(this.element, duration).then(resolve);
            });
        }
        // Fade out the element
        FadeIn(duration) {
            return new Promise((resolve) => {
                this.animate.FadeIn(this.element, duration).then(resolve);
            });
        }
    }
    // Base User Interface Class
    class UI {
        // UI Setup
        constructor(screen, audio) {
            this.audio = audio;
            this.screen = screen;
        }
        // Set a background image
        Background(filename) {
            this.screen.style.background = `url(assets/images/${filename}) center center no-repeat`;
        }
        // Create a UI element from a template
        CreateElement(template) {
            let element = new UIElement(template, this.screen);
        }
        // Draw a new element on the screen
        // Register dialog events
        DrawDialog(template) {
            return new Promise((resolve) => {
                let wrap = document.createElement("div");
                wrap.innerHTML = template;
                let dialog = wrap.firstChild;
                dialog.classList.add("ui-dialog");
                this.screen.appendChild(dialog);
                this.ParseDialog(dialog).then(() => {
                    resolve(dialog);
                });
            });
        }
        // Remove a dialog
        RemoveDialog(dialog) {
            this.screen.removeChild(dialog);
        }
        // Register the events bound to the dialog we just loaded.
        // Dialog Events only fire once and are immediately removed
        ParseDialog(src) {
            return new Promise((resolve) => {
                let elements = src.querySelectorAll("*");
                elements.forEach((el) => {
                    // Register Dialog Events
                    if (el.dataset.onevent
                        && el.dataset.doevent) {
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
    engine.UI = UI;
})(engine || (engine = {}));
/* ===== Engine: Game ===== */
var engine;
(function (engine) {
    // The core game engine
    class Game {
        // Game Initialization
        constructor(config, description) {
            // Set Object Properties
            this.config = config;
            this.description = description;
            this.scenes = [];
            this.screen = document.getElementById("screen");
            this.audio = new engine.GameAudio(this.config.soundPath, this.config.musicPath);
            this.level = new engine.Level(this.screen);
            this.ui = new engine.UI(this.screen, this.audio);
            this.events = new engine.Events;
            this.player = new engine.Player;
        }
        // Register a scene in the game object
        RegisterScene(config) {
            let scene = {
                name: config.name,
                run: config.run,
            };
            this.scenes.push(scene);
        }
        // Load a Scene
        LoadScene(name) {
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
        Exit(error) {
            console.error(error);
            clearInterval(this.level.loop);
        }
    }
    engine.Game = Game;
})(engine || (engine = {}));
/*
* ===== Errand Boy =====
* A SNES style Browser RPG Written in Typescript
* This file is the 'launcher' for the game
* Rendering is controlled by
*/
let game;
let audio;
let ui;
let events;
let player;
// Game Startup
// Create a new Game Object configured with args
window.onload = function () {
    // Game Description
    let description = {
        title: "Errand Boy",
        description: "An attempt at a 2D SNES Style RPG",
        author: "github.com/markorm",
    };
    // Game Configuration
    let config = {
        debug: true,
        framerate: 30,
        soundPath: "assets/sounds",
        musicPath: "assets/music"
    };
    // Build our game object
    game = new engine.Game(config, description);
    // Assign useful game methods to their own variables...
    // ...to have a cleaner interface when calling them in scenes
    audio = game.audio;
    events = game.events;
    player = game.player;
    ui = game.ui;
    // Register our scenes
    // Scenes are objects with a name, id and a handler function
    game.RegisterScene({
        name: "intro",
        run: __intro
    });
    // Run the Intro Scene
    game.LoadScene("intro");
};
/* ===== Engine: Player ===== */
var engine;
(function (engine) {
    class Player {
        constructor() {
            // Check that a local player exists
            this.CheckLocal();
        }
        CheckLocal() {
            this.local = false;
        }
        New(data) {
            let nameField = data.querySelectorAll('[data-player="name"]')[0];
            this.name = nameField.value;
            this.level = 1;
            this.health = 100;
            this.energy = 100;
            this.Save();
        }
        // Save the player object to local storage
        Save() {
        }
        // Load the player from local storage
        Load() {
            this.local = true;
        }
    }
    engine.Player = Player;
})(engine || (engine = {}));
/* ===== Engine: Canvas ===== */
var engine;
(function (engine) {
    class Level {
        constructor(screen) {
            this.screen = screen;
            this.canvas = document.createElement("canvas");
            this.canvas.id = "level";
            this.ctx = this.canvas.getContext("2d");
            this.screen.appendChild(this.canvas);
        }
        // Fire up the game loop
        // Execute all the callbacks in the queue
        // Exists the game on error
        Start() {
            return new Promise((resolve) => {
                let interval = 1000 / game.config.framerate;
                this.loop = setInterval(() => {
                }, interval);
                resolve();
            });
        }
    }
    engine.Level = Level;
})(engine || (engine = {}));
/*  ===== Engine: Sound ===== */
var engine;
(function (engine) {
    class GameAudio {
        constructor(soundPath, musicPath) {
            this.soundPath = soundPath;
            this.musicPath = musicPath;
            this.music = new Audio();
        }
        // Play Music
        PlayMusic(filename) {
            this.music.src = this.musicPath + "/" + filename;
            this.music.loop = true;
            this.music.play();
        }
        // Play a sound and add it to the list of playing sounds
        // When the sound ends it is removed from the queue
        PlaySound(filename) {
            let sound = new Audio(this.soundPath + "/" + filename);
            sound.id = filename;
            sound.play();
        }
    }
    engine.GameAudio = GameAudio;
})(engine || (engine = {}));
//# sourceMappingURL=build.js.map