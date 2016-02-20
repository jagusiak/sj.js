window.SJ.module('scene', function (sj) {
    "use strict";

    function SJScene(render, data) {
        var scene = this;
        scene.objects = {};
        scene.sounds = {};
        /**
         * Start scene - initalizes textures and sounds
         * @return {[type]} [description]
         */
        scene.start = function () {
            var textures = {};
            for (var i in scene.objects) {
                var object = scene.objects[i];
                if (object.texture && !sj.texture.loaded(object.texture.name)) {
                    textures[object.texture.name] = true;
                }
            }
            for (var textureName in textures) {
                sj.texture.load(textureName);
            }
            for (var soundName in scene.sounds) {
                sj.sound.load(soundName);
            }
            render.start(scene);
        };
        /**
         * Stop scene - nottifies renderer to stop drawing scene
         */
        scene.stop = function () {
            render.stop(scene);
        };
        /**
         * Renders frame
         */
        scene.frame = function () {
            render.frame(scene);
        };
        /**
         * Creates new canvas object
         * @param  {String} name Object identifier
         */
        scene.createObject = function (name) {
            if (!scene.objects[name]) {
                var object = sj.canvasobject.create(name);
                scene.objects[name] = object;
                return object;
            } else {
                new Error("Object with name '" + name + "' already exists in scene");
            }
        };
        /**
         * Removes object (notifies render about removal)
         * @param  {String} name Object identifier
         */
        scene.removeObject = function (name) {
          if (scene.objects[name]) {
              render.remove(scene.objects[name]);
              delete scene.objects[name];
          }
        };
        /**
         * Return scene object by identifier
         * @param  {String} name Object identifier
         * @return {CanvasObject} Returns objects
         */
        scene.getObject = function (name) {
            return scene.objects[name];
        };
        /**
         * Adds sound to scene
         * @param  {String} name Sound identifier
         */
        scene.attachSound = function (name) {
          if (!scene.sounds[name]) {
              var object = sj.sound.get(name);
              scene.sounds[name] = object;
              return object;
          } else {
              new Error("Sound with name '" + name + "' already attached scene");
          }
        };
        /**
         * Removes sound from
         * @param  {String} name Sound identifier
         */
        scene.dettachSound = function (name) {
            delete scene.sounds[name];
        };
        /**
         * Get sound object from scene
         * @param  {String} name Sound identifier
         */
        scene.getSound = function (name) {
            return scene.sounds[name];
        };

        // defualt
        if (data && data.objects) {
            for (var name in data.objects) {
                var object = scene.createObject(name),
                    objectData = data.objects[name];
                if (objectData.position) {
                    object.setPosition(objectData.position.x, objectData.position.y, objectData.position.z);
                }
                if (objectData.rotation) {
                    object.setRotation(objectData.rotation);
                }
                if (objectData.dimension) {
                    object.setDimension(objectData.dimension.width, objectData.dimension.height);
                }
                if (objectData.texture) {
                    object.setTexture(sj.texture.get(objectData.texture.name), objectData.texture.left, objectData.texture.top, objectData.texture.right, objectData.texture.bottom);
                }
            }
        }

        if (data && data.sounds) {
            for (var i in data.sounds) {
                var sound = data.sounds[i];
                scene.attachSound(sound);
            }
        }

        if (data && data.textures) {
            for (var j in data.textures) {
                sj.texture.load(data.textures[j]);
            }
        }
    }

    return {
        /**
         * Creates new scene
         * @param  {[type]} render [description]
         * @param  {[type]} data   [description]
         * @return {SJScene}        [description]
         */
        create: function (render, data) {
            return new SJScene(render, data);
        }
    };
});
