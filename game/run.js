/*
* ===== Errand Boy =====
* A SNES style Browser RPG Written in Typescript
* This file is the 'launcher' for the game
* Rendering is controlled by
*/
var game;
// Game Startup
// Create a new Game Object configured with args
window.onload = function () {
    // Game Description
    var description = {
        name: "Errand Boy",
        description: "An attempt at a 2D Snes Style RPG",
        author: "github.com/markorm"
    };
    // Game Configuration
    var config = {
        framerate: 60
    };
    // Build our game object
    game = new engine.Game(config, description);
    // Attach the game object to the window.
    // This is for debugging, game objects do not need to be attached to the window.
    window.game = game;
    // Register our scenes
    // Scenes are objects with a name, id and a handler function
    game.RegisterScene({
        name: "intro",
        run: introHandler
    });
    // Start the game
    // The game returns a promise when core loading has completed.
    game.Start().then(function () {
        // Run the Intro Scene
        game.LoadScene("intro");
    });
};
