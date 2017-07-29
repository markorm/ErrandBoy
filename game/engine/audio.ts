/*  ===== Engine: Sound ===== */

namespace engine {

    export class GameAudio {

        music: HTMLAudioElement;
        soundPath: string;
        musicPath: string;

        constructor(soundPath:string, musicPath:string) {
            this.soundPath = soundPath;
            this.musicPath = musicPath;
            this.music = new Audio();
        }

        // Play Music
        public PlayMusic(filename:string) {
            this.music.src = this.musicPath + "/" + filename;
            this.music.loop = true;
            this.music.play();
        }

        // Play a sound and add it to the list of playing sounds
        // When the sound ends it is removed from the queue
        public PlaySound(filename:string) {
            let sound = new Audio(this.soundPath + "/" + filename);
            sound.id = filename;
            sound.play();
        }

    }

}