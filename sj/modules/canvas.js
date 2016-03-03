window.SJ.module('canvas', function(sj) {
    "use strict";

    var fps = sj.config('canvas', 'fps') || 20, // fps value
        frameTime = 1000/fps, // calculated frame duration
        scenes = {}, // scene list
        runningScene, // current running scene - one in the momemnt - stores name of scene - not object
        runThread = false, // determines if thread is running
        render, // renderer object
        element = document.getElementById(sj.config('canvas', 'canvas_id')), // canvas html element (DOM)
        loaderName = sj.config('canvas', 'loader') || 'loader';

    /**
     * Thread function -  it is run in loop
     */
    function run() {
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
