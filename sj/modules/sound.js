window.SJ.module('sound', function(sj) {
    "use strict";

    var config = sj.config("sound", "sounds"),
        sounds = {},
    SJSound = function() {
        var instance = this;
        instance.play = function() {
            instance.sound.currentTime = 0;
            instance.sound.play();
        };
    },
    exists = function (name) {
        if (!config[name]) {
            throw new Error("Sound '" + name + "' not defined!");
        }
        return true;
    };

    for (var name in config) {
        sounds[name] = new SJSound();
        sounds[name].name = name;
    }

    return {
        /**
         * Loads sound to memory (loads file)
         * @param  {String} name Sound name (represents name from config file)
         */
        load : function(name) {
            if (exists(name) && !sounds[name].sound) {
                sounds[name].sound = sj.utils.loadSound(config[name]);
            }
        },
        /**
         * Unloads sound from memory (unloads file)
         * @param  {String} name Sound name (represents name from config file)
         */
        unload : function(name) {
            if (exists(name) && sounds[name].image) {
                delete sounds[name].image;
            }
        },
        /**
         * Gets sound
         * @param  {SJSound} name Sound name (represents name from config file)
         */
        get : function(name) {
            if (exists(name)) {
                return sounds[name];
            }
        },
        /**
         * Check if sound is loaded
         * @param  {String} name Sound name (represents name from config file)
         */
        loaded : function(name) {
            if (exists(name)) {
                return !!sounds[name].image;
            }
        }
    };
});
