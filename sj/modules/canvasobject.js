window.SJ.module('canvasobject', function (sj) {
    "use strict";

    /**
     * Creates scene object - main element of display
     *
     * @param {String} name Object name (identifier, unique per scene)
     * @returns {SJCanvasObject}
     */
    function SJCanvasObject(name) {
        var object = this;
        // set identifier (name)
        this.name = name;

        // set default values
        // dimension
        this.width = 1;
        this.height = 1;
        // rotation
        this.rotation = 0;
        // position
        this.x = 0;
        this.y = 0;
        this.z = 1; // this one is for depth

        this.visible = true;
        /**
         * Sets element position
         *
         * @param {Float} x - x position
         * @param {Float} y - y position
         * @param {Integer|undefined} z - depth
         */
        this.setPosition = function (x, y, z) {
            object.x = x;
            object.y = y;
            object.z = z | 1;
            // notify about changed position
            object.translated = true;
        };

        /**
         * Sets object dimesnion
         *
         * @param {Float} w Object width
         * @param {Float} h Object height
         */
        this.setDimension = function (w, h) {
            this.width = w;
            this.height = h;
            // notify about changed dimensions
            object.scaled = true;
        };

        /**
         * Sets object visibility
         *
         * @param {Boolean} v Object visibility
         */
        this.setVisible = function (v) {
            object.visible = v;
            // notify about changed visiblity
            object.displayed = true;
        };

        /**
         * Sets object rotation dur center point
         * @param {Float} rotation Object rotation value in radians
         */
        this.setRotation = function (rotation) {
            object.rotation = rotation;
            // notify about rotation
            object.rotated = true;
        };

        /**
         * Sets object texture
         *
         * @param {SJTexture} texture Texture object loaded by texture module
         * @param {Float} left (0,1) Defines in which postion left edge should be placed regarding texture, ie 0,.5 means that texture starts from half
         * @param {Float} top (0,1) Defines in which postion top edge should be placed regarding texture
         * @param {Float} right (0,1) Defines in which postion right edge should be placed regarding texture
         * @param {Float} bottom (0,1) Defines in which postion bottom edge should be placed regarding texture
         */
        this.setTexture = function (texture, left, top, right, bottom) {
            object.texture = texture;
            object.textureLeft = left;
            object.textureRight = right;
            object.textureTop = top;
            object.textureBottom = bottom;
            // notify about texturing
            object.textured = true;
        };

    }

    return {
        /**
         * Return new object
         *
         * @param {String} name Object name
         * @returns {SJCanvasObject}
         */
        create: function (name) {
            return new SJCanvasObject(name);
        }
    };
});
