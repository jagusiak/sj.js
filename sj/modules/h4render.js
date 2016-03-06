window.SJ.module('h4render', function (sj) {
    "use strict";

    var canvas, width, height, ratioX, ratioY,
    /**
     * Set object position
     *
     * @param {CanvasObject} object
     */
    setPosition = function (object) {
        var div = object.rh4;
        div.style.top = ratioY * (object.y - object.height/2) + "px";
        div.style.left = ratioX * (object.x - object.width/2) + "px";
        div.style.zIndex = object.z | 1;
        object.translated = false;
    },
    /**
     * Sets object dimension
     *
     * @param {CanvasObject} object
     */
    setDimension = function(object) {
        var div = object.rh4;
        div.style.width = ratioX * object.width + "px";
        div.style.height = ratioY * object.height + "px";
        object.scaled = false;
    },
    /**
     * Sets object rotation
     *
     * @param {CanvasObject} object
     */
    setRotation = function(object) {
        object.rh4.style.transform = 'rotate(' + object.rotation + 'rad)';
        object.rotated = false;
    },
    /**
     * Sets object texture
     *
     * @param {CanvasObject} object
     */
    setTexture = function(object) {
        var bgWidth = 100.0 / (object.textureRight - object.textureLeft),
                bgHeight = 100.0 / (object.textureBottom - object.textureTop),
                div = object.rh4,
                posX = (bgWidth == 100 ? 100 * object.textureLeft : (object.textureLeft/(1-((object.textureRight - object.textureLeft)))*100)),
                posY = (bgHeight == 100 ? 100 * object.textureTop : (object.textureTop/(1-((object.textureBottom - object.textureTop)))*100));
        div.style.backgroundImage = "url('" + object.texture.image.src + "')";
        div.style.backgroundSize = bgWidth + "% " + bgHeight + "%";
        div.style.backgroundPosition = posX + "% " + posY + "%";
        object.textured = false;
    },
    /**
     * Sets object visibility
     *
     * @param {CanvasObject} object
     */
    setVisibility = function(object) {
        object.rh4.style.display = object.visible ? 'block' : 'none';
        object.rotated = false;
    };

    return {
        /**
         * Initalizes render - setup
         *
         * @param {DOMElement} canvasElement
         * @param {Integer} canvas virtual width
         * @param {Integer} canvas viertual height
         */
        init: function (canvasElement, w, h) {
            canvas = canvasElement;
            width = w;
            height = h;
            ratioX = canvas.offsetWidth / w;
            ratioY = canvas.offsetHeight / h;
        },
        /**
         * Starts rendering scene
         *
         * @param {SJScene} scene
         */
        start: function (scene) {
            for (var i in scene.objects) {
                var object = scene.objects[i],
                        div = document.createElement('div');
                div.id = 'sj-rh4-' + object.name;
                div.style.position = 'absolute';
                object.rh4 = div;
                canvas.appendChild(div);
                setPosition(object);
                setDimension(object);
                setRotation(object);
                setTexture(object);
                setVisibility(object);
            }
            scene.started = true;
        },
        /**
         * Stops rendering scene
         *
         * @param {SJScene} scene
         */
        stop: function (scene) {
            scene.started = false;
            for (var i in scene.objects) {
                var object = scene.objects[i];
                canvas.removeChild(object.rh4);
                delete object.rh4;
            }
        },
        /**
         * Notify about object removal
         *
         * @param {CanvasObject} object
         */
        remove: function(object) {
            canvas.removeChild(object.rh4);
        },
        /**
         * Renders single frame
         *
         * @param {SJScene} scene
         */
        frame: function (scene) {
            if (scene.started) {
                for (var i in scene.objects) {
                    var object = scene.objects[i];
                    if (object.translated) {
                        setPosition(object);
                    }
                    if (object.rotated) {
                        setRotation(object);
                    }
                    if (object.textured) {
                        setTexture(object);
                    }
                    if (object.scaled) {
                        setDimension(object);
                    }
                    if (object.displayed) {
                        setVisibility(object);
                    }
                }
            }
        }
    };
});
