/* Engine Core */
var engine;
(function (engine) {
    // The core game engine
    var Game = (function () {
        // Game Initialization
        function Game(config, description) {
            // Set Object Properties
            this.scenes = [];
            this.config = config;
            this.description = description;
            // Build the game screen element
            this.screen = document.getElementById("screen");
        }
        // Register a scene in the game object
        Game.prototype.RegisterScene = function (config) {
            var scene = {
                name: config.name,
                run: config.run,
                loop: []
            };
            this.scenes.push(scene);
        };
        // Load a Scene
        Game.prototype.LoadScene = function (name) {
            var ok = false;
            this.scenes.forEach(function (scene) {
                if (scene.name === name) {
                    scene.run();
                    ok = true;
                }
            });
            if (!ok) {
                var error = new Error("Failed to find scene: " + name);
                this.Exit(error);
            }
        };
        // Fire up the game loop
        Game.prototype.Start = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var interval = 1000 / _this.config.framerate;
                _this.loop = setInterval(function () {
                    // Execute the callbacks in the game loop array
                    console.log('Game Loop');
                }, interval);
                resolve();
            });
        };
        // Kill the game loop
        Game.prototype.Exit = function (error) {
            console.error(error);
            clearInterval(this.loop);
        };
        return Game;
    }());
    engine.Game = Game;
})(engine || (engine = {}));
