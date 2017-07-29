/*
* ===== Errand Boy =====
* A SNES style Browser RPG Written in Typescript
* This file is the 'launcher' for the game
* Rendering is controlled by
*/

let game:engine.Game;
let audio:engine.GameAudio;
let ui:engine.UI;
let events:engine.Events;
let player:engine.Player;

// Game Startup
// Create a new Game Object configured with args
window.onload = function() {

    // Game Description
    let description:engine.GameDescription = {
        title: "Errand Boy",
        description: "An attempt at a 2D SNES Style RPG",
        author: "github.com/markorm",
    };

    // Game Configuration
    let config:engine.GameConfig = {
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