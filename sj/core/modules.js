/**
 * Autoload of modules.
 * Loads modules from sj.settings.modules
 * Adds sj.module(name, code) function
 *
 * @param {SJ} sj
 */
(function(sj) {

    sj.module = function(name, code) {
        if (!sj.settings.modules[name]) {
            console.error('Module ' + name + ' not found in settings');
        }

        if (sj[name]) {
            console.error('Cannot reserve name ' + name);
        }

        sj[name] = code(sj);
    };


    // loads core modules
    if (sj.settings.modules) {
        for (var name in sj.settings.modules) {
            if (!sj[name]) {
                sj.script.load(sj.settings.modules[name]+ '.js');
            }
        }
    }
})(window.SJ);
