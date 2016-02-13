/**
 * Loads config files
 * COnfig files are stored in sj.settings.configuration
 *
 * @param {SJ} sj
 */
(function(sj) {
    "use strict";

    // config filenames (these are names of files in config location)
    var configs = sj.settings.configuration,
        configData = {};


    for (var config in configs) {
        var data = configs[config],
            file = data.file + '.json';
        switch (data.scope) {
            case "FULL" :
                if (!Object.keys(configData[config] = sj.json.load(sj.getApp() + "/config/" + file)).length) {
                    configData[config] = sj.json.load('sj/config/' + file);
                }
                break;
            case "APP" :
                configData[config] = sj.json.load(sj.getApp() + "/config/" + file);
                break;
            default :
                configData[config] = sj.json.load("sj/config/" + file);
        }
    }

    sj.config = (function(configuration) {
        var data = configuration;

        return function(name, item) {
            return data[name][item];
        };
    }(configData));

})(window.SJ);
