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
     * @param {String} settings Setting type: 'base' or 'full'
     * @returns {Boolean}
     */
    function init(appName, settings) {
        app = (!appName ? 'app' : appName);
        app = (!settings ? 'full' : settings);
        //<-- INIT START
        for (var file in core) {
            script.load(core[file]);
        }
        //--> INIT STOP
        return true;
    }

    return {
        init: init,
        script : script,
        json : json,
        getApp : function() { return app; },
        getSettings : function() { return settings; }
    };
}());
