window.SJ.module('texture', function(sj) {
    "use strict";

    var config = sj.config("texture", "textures"),
        textures = {};


    function SJTexture() {
    }

    for (var name in config) {
        textures[name] = new SJTexture();
        textures[name].name = name;
    }

    function exists(name) {
        if (!config[name]) {
            throw new Error("Texture '" + name + "' not defined!");
        }
        return true;
    }

    return {
        /**
         * Loads texture to memory (loads file)
         * @param  {String} name Texture name (represents name from config file)
         */
        load : function(name) {
            if (exists(name) && !textures[name].image) {
                textures[name].image = sj.utils.loadImage(config[name]);
            }
        },
        /**
         * Unload texture from memory (unloads file)
         * @param  {String} name Texture name (represents name from config file)
         */
        unload : function(name) {
            if (exists(name) && textures[name].image) {
                delete textures[name].image;
            }
        },
        /**
         * Returns texture object
         * @param  {SJTextrue} name Texture name (represents name from config file)
         */
        get : function(name) {
            if (exists(name)) {
                return textures[name];
            }
        },
        /**
         * Determines if texture was loaded
         * @param  {SJTextrue} name Texture name (represents name from config file)
         */
        loaded : function(name) {
            if (exists(name)) {
                return !!textures[name].image;
            }
        }
    };
});
