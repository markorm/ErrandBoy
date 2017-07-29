/*  ===== Engine: Sound ===== */
var engine;
(function (engine) {
    var Sound = (function () {
        function Sound() {
            this.music = new Audio();
        }
        // Play Music
        Sound.prototype.PlayMusic = function (filename) {
            if (this.music !== undefined) {
                this.StopMusic();
            }
            this.music.src = filename;
            this.music.loop = true;
            this.music.play();
        };
        // Stop the currentply playing audio
        Sound.prototype.StopMusic = function () {
            this.music = undefined;
            this.music.pause();
        };
        // Play a sound and add it to the list of playing sounds
        // When the sound ends it is removed from the queue
        Sound.prototype.PlaySound = function (filename, id) {
            var _this = this;
            var sound = new Audio(filename);
            sound.id = id;
            this.sounds.push(sound);
            sound.play();
            sound.addEventListener("ended", function () {
                _this.StopSound(sound.id);
            });
        };
        // Stop a single sound and remove it from the list
        Sound.prototype.StopSound = function (id) {
            var _this = this;
            this.sounds.forEach(function (sound, i) {
                if (sound.id === id) {
                    sound.pause();
                    delete _this.sounds[i];
                }
            });
        };
        // Stop All Sounds
        Sound.prototype.StopSounds = function () {
            var _this = this;
            this.sounds.forEach(function (sound, i) {
                sound.pause();
                delete _this.sounds[i];
            });
        };
        return Sound;
    }());
    engine.Sound = Sound;
})(engine || (engine = {}));
