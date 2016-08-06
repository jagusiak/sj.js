window.SJ.module('hittest', function(sj) {
    "use strict";

    /**
     * Quad Tree object used to store rectangular object in a structure allowing to fast lookup for hittest
     * @param  {SJQuadTree} p Parent Quad Tree
     * @param  {Integer} lvl Actual depth of tree
     * @param  {Float} l Left rectangular boundry
     * @param  {Float} t Top rectangular boundry
     * @param  {Float} r Right rectangular boundry
     * @param  {Float} b Bottom rectangular boundry
     * @param  {Integer} maxObjetcs Number of objects per one deph quad
     * @param  {Integer} maxLevels Maximal number of levels
     * @param  {Function} bnd Boundry function - calculates boundries for object
     */
    var SJQuadTree = function(p, lvl, l, t, r, b, maxObjetcs, maxLevels, bnd) {
        var MAX_OBJECTS = maxObjetcs || 16,
            MAX_LEVELS = maxLevels || 4,
            level = lvl,
            objects = [],
            nodes = [],
            left = l,
            top = t,
            right = r,
            bottom = b,
            boundry = bnd,
            centerX = (left+right)/2.0,
            centerY = (top+bottom)/2.0,
            parent = p,
            tree = this;

        // undefined boundry function - use default working with canvas object
        if (!boundry) {
            boundry = function(object) {
                return {
                    left: object.x,
                    top: object.y,
                    right: object.x + object.width,
                    bottom: object.y + object.height
                };
            };
        }

        /**
         * Split node into four parts
         */
        this.split = function() {
            nodes[0] = new SJQuadTree(this, level+1, centerX, top, right, centerY);
            nodes[1] = new SJQuadTree(this, level+1, left, top, centerX, centerY);
            nodes[2] = new SJQuadTree(this, level+1, left, centerY, centerX, bottom);
            nodes[3] = new SJQuadTree(this, level+1, centerX, centerY, right, bottom);

            // reassign elements
            for (var o = 0; o < objects.length;) {
                var object = objects[o], oIndex = tree.findNode(object.hitTestBoundries.left, object.hitTestBoundries.top, object.hitTestBoundries.right, object.hitTestBoundries.bottom);
                if (undefined !== oIndex) {
                    nodes[oIndex].put(objects[o]);
                    objects.splice(o, 1);
                } else {
                    o++;
                }
            }
        };

        /**
         * Finds child node index for given boundry parameters
         * @param  {Float} l Left rectangular boundry
         * @param  {Float} t Top rectangular boundry
         * @param  {Float} r Right rectangular boundry
         * @param  {Float} b Bottom rectangular boundry
         * @return {Integer} Array index value
         */
        this.findNode = function(l, t, r, b) {
            var index;
            if (b < centerY) {
                if (l > centerX) {
                    index = 0;
                } else if (r < centerX) {
                    index = 1;
                }
            } else if (t > centerY) {
                if (l > centerX) {
                    index = 3;
                } else if (r < centerX) {
                    index = 2;
                }
            }
            return index;
        };

        /**
         * Adds object to hitmap
         * @param  {Object} object Object which will be sotred in hitmap
         */
        this.put = function(object) {
            var l, t, b, r, boundries, index;
            if (!object.hitTestBoundries) {
                object.hitTestBoundries = boundry(object);
            }

            if ((objects.length < MAX_OBJECTS &&  !nodes.length) || objects.level == MAX_LEVELS) {
                objects.push(object);
            } else {
                index = tree.findNode(object.hitTestBoundries.left, object.hitTestBoundries.top, object.hitTestBoundries.right, object.hitTestBoundries.bottom);
                if (index === undefined) {
                    objects.push(object);
                } else {
                    if (!nodes.length) {
                        tree.split();
                    }
                    nodes[index].put(object);
                }
            }
        };

        /**
         * Returns objects which hit given object
         * @param  {Object} object Object which is tested
         * @return {Object[]} Objects array
         */
        this.test = function(object) {
            return tree.hit(boundry(object), {});
        };

        /**
         * Returns objects which hit given boundry
         * @param  {Object} boundries Boundry object
         * @return {Object[]} Objects array
         */
        this.hit = function(boundries) {
            var
                foundObjects = [],
                foundNode = tree.findNode(boundries.left, boundries.top, boundries.right, boundries.bottom);
            if (undefined !== foundNode && !!nodes[foundNode]) {
                foundObjects = foundObjects.concat(nodes[foundNode].hit(boundries));
            }
            for (var i in objects) {
                var object = objects[i];
                if (
                    ((object.hitTestBoundries.left <= boundries.left && object.hitTestBoundries.right >= boundries.left) || (object.hitTestBoundries.left <= boundries.right && object.hitTestBoundries.right >= boundries.right)) &&
                    ((object.hitTestBoundries.top <= boundries.top && object.hitTestBoundries.bottom >= boundries.top) || (object.hitTestBoundries.top <= boundries.bottom && object.hitTestBoundries.bottom >= boundries.bottom))
                ) {
                    foundObjects.push(object);
                }
            }
            return foundObjects;
        };

        /**
         * Returns all object in array
         * @return {Object[]} Objects array
         */
        this.getAll = function() {
            var all = [];
            for (var i in nodes) {
                all = all.concat(nodes[i].getAll());
            }
            return all.concat(objects);
        };

        /**
         * Function used to clear child nodes
         */
        this.clear = function() {
            for (var i in objects) {
                delete objects[i].hitTestBoundries;
            }
            objects = [];

            for (var j in nodes) {
                nodes[j].clear();
                delete nodes[j];
            }
            nodes = [];
        };

        /**
         * Recalculates hitmap
         * Note: This function shouldn't be used to much as it consumes time
         */
        this.recalculate = function() {
            var objects = tree.getAll();
            tree.clear();
            for (var i in objects) {
                tree.put(objects[i]);
            }
        };
    },

    /**
     * HitTest object allows to determine objects hit themselves.
     * Note: It is working for static object which doesn't change their position.
     * When objects changed their position, hittest object must be recalculated.
     *
     * @param  {Float} left Left rectangular boundry
     * @param  {Float} top Top rectangular boundry
     * @param  {Float} right Right rectangular boundry
     * @param  {Float} bottom Bottom rectangular boundry
     * @param  {Integer} maxObjetcs Number of objects per one deph quad
     * @param  {Integer} maxLevels Maximal number of levels
     * @param  {Function} boundry Boundry function - calculates boundries for object
     * @return {Object} Function access object
     */
    SJHitTest = function(left, top, right, bottom, maxObjetcs, maxLevels, boundry) {
        var instance = new SJQuadTree(undefined, 0, left, top, right, bottom, maxObjetcs, maxLevels, boundry);

        return {
            /**
             * Adds object to hitmap
             * @param  {Object} object Object which will be sotred in hitmap
             */
            put: instance.put,
            /**
             * Returns objects which hit given object
             * @param  {Object} object Object which is tested
             * @return {Object[]} Objects array
             */
            test: instance.test,
            /**
             * Recalculates hitmap
             * Note: This function shouldn't be used to much as it consumes time
             */
            recalculate: instance.recalculate
        };
    };

    return {
        /**
         * Creates new hittest map
         *
         * @param  {Float} left Left rectangular boundry
         * @param  {Float} top Top rectangular boundry
         * @param  {Float} right Right rectangular boundry
         * @param  {Float} bottom Bottom rectangular boundry
         * @param  {Integer} maxObjetcs Number of objects per one deph quad
         * @param  {Integer} maxLevels Maximal number of levels
         * @param  {Function} boundry Boundry function - calculates boundries for object
         * @return {Object} Function access object
         */
        create: function(left, top, right, bottom, maxObjetcs, maxLevels, boundry) {
            return new SJHitTest(left, top, right, bottom, maxObjetcs, maxLevels, boundry);
        }
    };
});
