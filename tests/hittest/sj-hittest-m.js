if (typeof XMLHttpRequest === "undefined") {
    /*
     * Creates XMLHttpRequest.
     * Standard supports for IE browsers.
     *
     * @returns {ActiveXObject}
     */
    XMLHttpRequest = function () {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) {}
        try { return new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) {}
        throw new Error("This browser does not support XMLHttpRequest.");
  };
}

/**
 * Global variable SJ
 * This variable stores main application container with core functions
 */
window.SJ = (function () {
    "use strict";

    // app handler
    var app;

    // core directories location
    var core = {
        settings : 'sj/core/settings.js',
        config : 'sj/core/config.js',
        modules : 'sj/core/modules.js',
        run : 'sj/core/run.js'
    };

    /**
     * Script object - it is used to load script files
     * @type Function
     */
    var script = (function() {
        // local xhr object - one for all
        var xhr = new XMLHttpRequest();

        // run evaluation on ready state
        xhr.onreadystatechange = function() {
            if (this.readyState === (this.DONE || 4)) {
                eval(this.responseText);
            }
        };
        return {
            /**
             * Loads scripts in given location file name
             *
             * @param {String} file name
             * @returns {null}
             */
            load : function(file) {
                xhr.open('GET', file, false);
                xhr.send(null);
            }
        };
    })();

    var json = (function() {
        // local xhr object - one for all
        var xhr = new XMLHttpRequest(), response = null;

        // run evaluation on ready state
        xhr.onreadystatechange = function() {
            if (this.readyState === (this.DONE || 4)) {
                response = JSON.parse(this.responseText);
            }
        };
        return {
            /**
             * Loads scripts in given location file name
             *
             * @param {String} file name
             * @returns {null}
             */
            load : function(file) {
                xhr.open('GET', file, false);
                xhr.send(null);
                return response;
            }
        };
    }());

    /**
     * Intializes application by given app name.
     * Method will run configuration and modules from directory with the same
     * name as appName.
     *
     * @param {String} appName
     * @returns {Boolean}
     */
    function init(appName) {
        app = (!appName ? 'app' : appName);
        window.SJ.settings = {"configuration": {"canvas": {"scope": "FULL", "file": "canvas"}, "texture": {"scope": "APP", "file": "texture"}, "sound": {"scope": "APP", "file": "sound"}}, "modules": {"utils": "sj/modules/utils", "h4render": "sj/modules/h4render", "texture": "sj/modules/texture", "canvasobject": "sj/modules/canvasobject", "scene": "sj/modules/scene", "canvas": "sj/modules/canvas", "sound": "sj/modules/sound", "input": "sj/modules/input", "animation": "sj/modules/animation", "animationstates": "sj/modules/animationstates", "default": "sj/modules/default", "loader": "sj/modules/loader", "hittest": "sj/modules/hittest", "test_hittest": "APP_NAME/modules/test_hittest"}, "init": {"module": "test_hittest", "action": "init"}};
window.SJ.config = (function(configuration) {var data = configuration; return function(name, item) {return data[name][item]; };}({"sound": {}, "texture": {"textures": {"dr_mario": "DrMario.png"}}, "canvas": {"canvas_id": "sj-canvas", "redner": "h4renderer", "loader": "loader", "fps": 20}}));
window.SJ.module = function(name, code) { if (!window.SJ.settings.modules[name]) {console.error('Module ' + name + ' not found in settings');} if (window.SJ[name]) {console.error('Cannot reserve name ' + name);} window.SJ[name] = code(window.SJ);};
window.SJ.module('utils', function(sj) {
    

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

window.SJ.module('h4render', function (sj) {
    

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

window.SJ.module('texture', function(sj) {
    

    var config = sj.config("texture", "textures"),
        textures = {},
    SJTexture = function() {
    },
    exists = function(name) {
        if (!config[name]) {
            throw new Error("Texture '" + name + "' not defined!");
        }
        return true;
    };

    for (var name in config) {
        textures[name] = new SJTexture();
        textures[name].name = name;
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

window.SJ.module('canvasobject', function (sj) {
    

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

window.SJ.module('scene', function (sj) {
    

    var SJScene = function(render, data) {
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
                object.setVisible(objectData.visibility);
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
    };

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

window.SJ.module('canvas', function(sj) {
    

    var fps = sj.config('canvas', 'fps') || 20, // fps value
        frameTime = 1000/fps, // calculated frame duration
        scenes = {}, // scene list
        runningScene, // current running scene - one in the momemnt - stores name of scene - not object
        runThread = false, // determines if thread is running
        render, // renderer object
        element = document.getElementById(sj.config('canvas', 'canvas_id')), // canvas html element (DOM)
        loaderName = sj.config('canvas', 'loader') || 'loader',
        run = function() {
        // current time
        var time = (new Date()).getMilliseconds();
        // run if scene is selected
        if (runningScene) {
            // running scene object
            var scene = scenes[runningScene];
            // execute app defined action - on frame
            if (scene.onFrame) {
                scene.onFrame();
            }
            // run default scene frame action - defined by framework
            scene.frame();
        }
        // continue "thread" only if it was stoped
        if (runThread) {
            // run again function after frameTime (minus processing frame time)
            setTimeout(run, Math.max(1,frameTime - (new Date()).getMilliseconds() + time));
        }
    }

    return {
        /**
         * Initialize canvas = sets renderer options
         */
        init : function() {
            // get render name (render is module)
            render = sj[sj.config('canvas', 'render') || 'h4render'];
            // handle missing render
            if (!render) {
                throw new Error("Render not found!");
            }

            // initalize render using options
            render.init(
                element,
                sj.config('canvas', 'width') || 1,
                sj.config('canvas', 'height') || 1
            );
        },
        /**
         * Creates new scene with given name
         *
         * @param {String} name Scene name
         * @param {Object|undefined} data Scene data - it allows to create ready scene from scene config
         * @returns {SJScene}
         */
        createScene : function(name, data) {
            // handles situation when scene with given name exists
            if (scenes[name]) {
                throw new Error("Scene name '" + name + "' alredy exists");
            }
            // store and return new scene
            scenes[name] = sj.scene.create(render, data);
            return scenes[name];
        },
        /**
         * Set scene as running
         *
         * @param {String} name Scene name
         */
        loadScene : function(name) {
            // get scene
            var scene = scenes[name],
            // get loader
            loader = sj.canvas.getLoader();

            // set loader - show initaial screen
            loader.start(element);

            // handle non existing scene
            if (!scene) {
                throw new Error("Scene name '" + name + "' does not exists");
            }

            // stop previous scene if running
            if (runningScene) {
                // retrieve previous scene
                scene = scenes[runningScene];
                // run app defined action onStop
                if (scene.onStop) {
                    scene.onStop();
                    // set loader progress
                    loader.progress(element, 25);
                }
                // stop scene - framework acrion
                scene.stop();
            }

            // mark progress
            loader.progress(element, 50);

            // store running scene name
            runningScene = name;
            // retrieve running scene object
            scene = scenes[runningScene];

            // run app defined action onStart
            if(scene.onStart) {
                scene.onStart();
                // mark progress
                loader.progress(element, 75);
            }
            // mark final progress
            loader.progress(element, 100);
            // finish loader actions
            loader.finish(element, scene.start);
        },
        /**
         * Reloads the same scene - all loading process is performed again
         */
        reloadScene : function() {
            sj.canvas.loadScene(runningScene);
        },
        /**
         * Returns scene related to given name
         * @param {String} name Scene name
         * @returns {Scene|undefined} Scene object
         */
        getScene : function(name) {
            return scenes[name];
        },
        /**
         * Removes scene
         *
         * @param {String} name Scene name
         */
        removeScene : function(name) {
            // handle not existing scene
            if (!scenes[name]) {
                throw new Error("Scena name does not '" + name + "' alredy exist");
            }
            // handle removing running scene
            if (runningScene === name) {
                throw new Error("Cannot remove running scene");
            }
            // handle framework defined on destroy function
            if (scenes[name].onDestroy) {
                scenes[name].onDestroy();
            }
            // destory scene
            scenes[name].destroy();
            // delete scene object
            delete scenes[name];
        },
        /**
         * Start rendering frame by freame
         */
        start : function () {
            // handle already running canvas
            if (!runThread) {
                // set proper flag
                runThread = true;
                // run thread
                run();
            }
        },
        /**
         * Stop frame rendering
         */
        stop : function () {
            // stop only if it is already running
            if (runThread) {
                // set proper flag
                runThread = false;
            }
        },
        /**
         * Returns cavnas element
         * @return {DOMElement}
         */
        getCanvas : function() {
            return element;
        },
        /**
         * Returns loader
         * @return {Object} loader object
         */
        getLoader : function() {
            return sj[loaderName];
        }
    };
});

window.SJ.module('sound', function(sj) {
    

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

window.SJ.module('input', function(sj) {
    

    var canvas = sj.canvas.getCanvas(),
        listeners = {},
        ratioX = canvas.offsetWidth / (sj.config('canvas', 'width') || 1),
        ratioY = canvas.offsetHeight / (sj.config('canvas', 'height') || 1),
    /**
     * Attaches event related to pressing keyCode
     * @param  {String} eventName Javascript event name, ie: keydown, keyup
     * @param  {Function} listener Listens to event, one argument is passed - key code
     * @param  {Boolean} preventDefault Optional - determines if default action shoul be taken - turned of by default
     */
    attachKeyEvent = function(eventName, listener, preventDefault) {
        var currentListener = listeners[eventName];
        detachKeyEvent(eventName);
        listeners[eventName] = function(event) {
            if (preventDefault) {
                event.preventDefault();
            }
            listener(event.keyCode);
        };
        document.addEventListener(eventName, listeners[eventName]);
    },
    /**
    * Attaches event related to mouse actions, ie: move, clicl
     * @param  {String} eventName Javascript event name, ie: mousemove, clik
     * @param  {Function} listener Listens to event, two argument are mouse position of action (x, y) regarding canvas size
     * @param  {Boolean} preventDefault Optional - determines if default action shoul be taken - turned of by default
     */
    attachMouseEvent = function(eventName, listener, preventDefault) {
        var currentListener = listeners[eventName];
        detachMouseEvent(eventName);
        listeners[eventName] = function(event) {
            if (preventDefault) {
                event.preventDefault();
            }
            listener((event.pageX - canvas.offsetLeft )/ratioX, (event.pageY - canvas.offsetTop)/ratioY);
        };
        canvas.addEventListener(eventName, listeners[eventName]);
    },
    /**
     * Detaches event with given name
     * @param  {String} eventName
     * @param  {Object} DOM element
     */
    detachMouseEvent = function(eventName) {
        var currentListener = listeners[eventName];
        if (currentListener) {
            // remove previous listener
            canvas.removeEventListener(eventName, currentListener);
            // dispose previous listener
            delete listeners[eventName];
        }
    },
    /**
     * Detaches event with given name
     * @param  {String} eventName
     * @param  {Object} DOM element
     */
    detachKeyEvent = function(eventName) {
        var currentListener = listeners[eventName];
        if (currentListener) {
            // remove previous listener
            document.removeEventListener(eventName, currentListener);
            // dispose previous listener
            delete listeners[eventName];
        }
    };

    return {
        KEY_BACKSPACE: 8,
        KEY_TAB : 9,
        KEY_ENTER : 13,
        KEY_SHIFT : 16,
        KET_CTRL : 17,
        KEY_ALT : 18,
        KEY_ESCAPE : 27,
        KEY_LEFT : 37,
        KEY_UP : 38,
        KEY_RIGHT : 39,
        KEY_DOWN : 40,

        onKeyDown : function(listener, preventDefault) {
            attachKeyEvent('keydown', listener, preventDefault);
        },
        onKeyUp : function(listener, preventDefault) {
            attachKeyEvent('keyup', listener, preventDefault);
        },
        onMouseMove : function(listner, preventDefault) {
            attachMouseEvent('mousemove', listner, preventDefault);
        },
        onMouseClick : function(listner, preventDefault) {
            attachMouseEvent('click', listner, preventDefault);
        },
        clearKeyDown : function() {
            detachKeyEvent('keydown');
        },
        clearKeyUp : function() {
            detachKeyEvent('keyup');
        },
        clearMouseMove : function() {
            detachMouseEvent('mousemove');
        },
        clearMouseClick : function() {
            detachMouseEvent('click');
        }
    };
});

window.SJ.module('animation', function(sj) {
    
    var animations = {},
    SJAnimation = function() {
        var animation = this,
            step = 1,
            currentStep = 0,
            currentFrame = 0,
            frames = [],
            loopped = true,
            stopped = false,
            onFrame = {};

        animation.addFrame = function(texture, left, top, right, bottom) {
            frames.push({
                texture: texture,
                left: left,
                top: top,
                right: right,
                bottom: bottom
            });
        };

        animation.addFrames = function(frames) {
            for (var i in frames) {
                var frame = frames[i];
                animation.addFrame(frame.texture, frame.left, frame.top, frame.right, frame.bottom);
            }
        };

        animation.onFrame = function(frameNumber, action) {
            if (frameNumber < 0 || frameNumber >= frames.length) {
                onFrame[frameNumber] = action;
            }
        };

        animation.detachFrame = function(frameNumber) {
            delete onFrame[frameNumber];
        };

        animation.detachAll = function() {
            for (var i = 0;  i < frames.length; i++) {
                animation.detachFrame(i);
            }
        };

        animation.setStep = function (s) {
            step = s;
        };

        animation.setLooped = function (l) {
            loopped = l;
        };

        animation.setCurrentFrame = function (f) {
            currentFrame = f | -1;
            currentStep = f*step;
            stopped = false;
        };

        animation.play = function (object) {
            var nextFrame = Math.floor(currentStep/step);
            if (nextFrame !== currentFrame) {
                if (nextFrame < frames.length || loopped) {
                    var frameData = frames[nextFrame % frames.length];
                    object.setTexture(frameData.texture, frameData.left, frameData.top, frameData.right, frameData.bottom);
                    currentFrame = nextFrame;
                } else {
                    stopped = true;
                }
            }
            currentStep++;
        };

        animation.hasStopped = function () {
            return stopped;
        };
    };

    return {
        create: function(name) {
            if (animations[name]) {
                throw new Error("Animation with name '" + name +  "' already exists");
            }
            animations[name] = new SJAnimation();
            return animations[name];
        },
        destroy : function(name) {
            delete animations[name];
        },
        get : function(name) {
            return animations[name];
        }
    };

});

window.SJ.module('animationstates', function(sj) {
    
    var animationStates = {},
    SJAnimationStates = function (s, t) {
        var states= {}, transitions = {}, currentState, stateExit = {}, stateEnter = {}, animationStates = this;

        animationStates.addState = function(name, animation) {
            if (states[name]) {
                throw new Error("Animation state with name '" + name + "' already exists");
            }

            states[name] = animation;

            if (!currentState) {
                animationStates.setState(name);
            }
        };

        animationStates.addStates = function(data) {
            for (var name in data) {
                animationStates.addState(name, data[name]);
            }
        };

        animationStates.onStateExit = function(name, action) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exists");
            }

            stateExit[name] = action;
        };

        animationStates.detachStateExit = function(name, action) {
            delete stateExit[name];
        };

        animationStates.detachAllStateExit = function() {
            for (var name in stateExit) {
                animationStates.detachStateExit(name);
            }
        };

        animationStates.onStateEnter = function(name) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exists");
            }

            stateEnter[name] = action;
        };

        animationStates.detachStateEnter = function(name) {
            delete stateEnter[name];
        };

        animationStates.detachAllStateEnter = function() {
            for (var name in stateEnter) {
                animationStates.detachStateEnter(name);
            }
        };

        animationStates.addTransition = function(fromState, toState) {
            if (!states[fromState]) {
                throw new Error("Animation state with name '" + fromState + "' doesn't exist");
            }

            if (!states[toState]) {
                throw new Error("Animation state with name '" + toState + "' doesn't exist");
            }

            transitions[fromState] = toState;
        };

        animationStates.addTransitions = function(data) {
            for (var name in data) {
                animationStates.addTransition(name, data[name]);
            }
        };

        animationStates.setState = function(name, frame) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exist");
            }

            if (stateExit[currentState]) {
                stateExit[name]();
            }

            currentState = name;

            if (stateEnter[currentState]) {
                stateExit[name]();
            }

            states[name].setCurrentFrame(frame || 0);
        };

        animationStates.getState = function(name, frame) {
            return currentState;
        };

        animationStates.play = function(object) {
            var currentAnimation = states[currentState];
            if(currentAnimation.hasStopped()) {

                var newState = transitions[currentState];
                if (newState) {
                    animationStates.setState(newState);
                    currentAnimation = states[newState];
                }

            }
            currentAnimation.play(object);
        };

        animationStates.addStates(s || {});
        animationStates.addTransitions(t || {});
    };

    return {
        create: function(name) {
            if (animationStates[name]) {
                throw new Error("Animation states with name '" + name +  "' already exists");
            }
            animationStates[name] = new SJAnimationStates();
            return animationStates[name];
        },
        destroy : function(name) {
            delete animationStates[name];
        },
        get : function(name) {
            return animationStates[name];
        }
    };

});

window.SJ.module('default', function(sj) {
    

    return {
        start : function() {
            alert("Welcome to sj.js\nI hope you will enjoy it!");
        }
    };
});

window.SJ.module('loader', function(sj) {
    

    var loader, progress;

    return {
        /**
         * Starts loader
         * @param  {CanvasObject} canvas Canvas object
         */
        start: function(canvas) {
            setTimeout(function() {
                if (!loader) {
                    var footer, title = document.createElement('div');
                    title.style.fontFamily = "'Lucida Console', Monaco, monospace";
                    title.style.position = "relative";
                    title.style.textAlign = "center";
                    title.style.lineHeight = "0px";
                    progress = title.cloneNode();
                    footer = title.cloneNode();
                    title.style.fontSize = "20px";
                    title.style.top = "45%";
                    title.innerHTML = "[SJ.JS]";
                    progress.style.fontSize = "15px";
                    progress.style.top = "70%";
                    progress.innerHTML = "(0%)";
                    footer.style.fontSize = "10px";
                    footer.style.top = "85%";
                    footer.innerHTML = "https://github.com/jagusiak/sj.js";
                    loader = canvas.cloneNode();
                    loader.style.backgroundColor = 'darkslategrey';
                    loader.style.color = 'white';
                    loader.appendChild(title);
                    loader.appendChild(progress);
                    loader.appendChild(footer);
                }
                canvas.parentNode.replaceChild(loader, canvas);
            },1);
        },
        /**
         * Marks progress
         * @param  {CanvasObject} canvas Canvas object to watch progress
         * @param  {Integer} percentage Percentage value
         */
        progress : function(canvas, percentage) {
            setTimeout(function() {
                progress.innerHTML = "(" + Math.round(percentage) + "%)";
            }, 1);
        },
        /**
         * Marks finish
         * @param  {CanvasObject} canvas Canvas object to watch progress
         * @param  {Function} callback Mark function finish
         */
        finish: function(canvas, callback) {
            setTimeout(function() {
                loader.parentNode.replaceChild(canvas, loader);
                callback();
            }, 1000);
        }
    };
});

window.SJ.module('hittest', function(sj) {
    

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

window.SJ.module('test_hittest', function(sj) {
    

    return {
        init : function() {
            // var
            //     test,
            //     hittest = sj.hittest.create(0, 0, 1, 1, 3,3);
            // for (var i = 0; i < 10; i++) {
            //     var object = sj.canvasobject.create('test_' + i);
            //     object.setPosition(0.3, 0.1*i);
            //     object.setDimension(0.1, 0.1);
            //     hittest.put(object);
            // }
            // test = sj.canvasobject.create('test');
            // test.setPosition(0.31,0.11);
            // test.setDimension(0.05,0.05);
            // console.log(hittest.test(test));
            // hittest.recalculate();
            // console.log(hittest.test(test));
            //


            var canvas = sj.canvas, scene, animation, animationstates, cursor, i, hitest = sj.hittest.create(0, 0, 1, 1.5, 3,3);

            canvas.init();
            sj.texture.load("dr_mario");
            scene = canvas.createScene('test');

            animationstates = sj.animationstates.create('dr_mario');

            animation = sj.animation.create('dr_mario');
            animation.setStep(5);
            for(i = 0; i < 3; i++) {
                animation.addFrame(sj.texture.get("dr_mario"), i*0.33, 0.0, (i+1)*0.33, 1.0);
            }
            animationstates.addState('stand', animation);

            for (var t = 0; t < 10; t++) {
                var mario = scene.createObject('mario_' + t);
                mario.setPosition(Math.random(), Math.random(), 2);
                mario.setDimension(0.1, 0.2);
                mario.setTexture(sj.texture.get('dr_mario'), 0, 0, 0.33, 1);
                hitest.put(mario);
            }

            cursor = scene.createObject('cursor');
            cursor.setPosition(Math.random(), Math.random(), 1);
            cursor.setDimension(0.1, 0.2);
            cursor.setTexture(sj.texture.get('dr_mario'), 0, 0, 0.33, 1);

            sj.input.onMouseMove(function(x,y){
                cursor.setPosition(x, y, 1);
            });

            scene.onFrame = function () {
                var test = hitest.test(cursor);
                for (var i in test) {
                    animationstates.play(test[i]);
                }
            };

            canvas.start();
            canvas.loadScene('test');
        }
    };
});
setTimeout(window.SJ[window.SJ.settings.init.module][window.SJ.settings.init.action], 1);

        return true;
    }

    return {
        init: init,
        script : script,
        json : json,
        getApp : function() { return app; }
    };
}());
