window.SJ.module('utils', function(sj) {
    "use strict";

    return {
        /**
         * Load image from given url
         * @param  {String} src Image location
         * @return {Image} Image object
         */
        loadImage: function(src) {
            var image = new Image();
            image.src = src;
            return image;
        },
        /**
         * Load sound from given url
         * @param  {String} src Sound location
         * @return {Audio} Sound objecy
         */
        loadSound: function(src) {
            var sound = new Audio(src);
            sound.load();
            return sound;
        },
    };
});
