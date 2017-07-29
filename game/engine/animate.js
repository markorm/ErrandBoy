/* ===== Engine: Animate ===== */
var engine;
(function (engine) {
    var Animate = (function () {
        function Animate() {
        }
        // Fade In an element over a duration
        // @param el: the element to fade
        // @param duration: the length of the transition in ms
        Animate.prototype.FadeIn = function (el, duration) {
            return new Promise(function (resolve) {
                var opacity = 0;
                var elOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue("opacity"));
                var dif = (1 - opacity) / duration;
                var fade = setInterval(function () {
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
        };
        // Fade out an element over a duration
        // @param el: the element to fade
        // @param duration: the length of the transition in ms
        Animate.prototype.FadeOut = function (el, duration) {
            return new Promise(function (resolve) {
                var opacity = 1;
                var elOpacity = parseFloat(window.getComputedStyle(el).getPropertyValue("opacity"));
                var dif = 1 / duration;
                var fade = setInterval(function () {
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
        };
        return Animate;
    }());
    engine.Animate = Animate;
})(engine || (engine = {}));
