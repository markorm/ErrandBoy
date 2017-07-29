/* ===== Engine: Animate ===== */

namespace engine {

    export class Animate {

        // Fade In an element over a duration
        // @param el: the element to fade
        // @param duration: the length of the transition in ms
        public FadeIn(el:HTMLElement, duration:number) {
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
        public FadeOut(el:HTMLElement, duration:number) {
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

}
