/**
 * Loads settings files and merge them into one.
 * Solid rule is simple, it takses sj/settings.json as base and overrides each
 * field in settings.json. Algoithm is recursive.
 *
 * Settings are stored in sj.settings object
 *
 * @param {SJ} sj
 */
(function(sj) {
    "use strict";

    var settings = /* MSJ S# */sj.json.load('sj/settings-' + sj.getSettings() + '.json')/* MSJ #S */,
        localSettings = /* MSJ L# */ sj.json.load(sj.getApp() + '/settings.json')/* MSJ L# */,
        updateRecursive = function(merged, local) {
        for (var index in local) {
            var element = local[index];
            if (!!merged[index] && typeof element == 'object') {
                updateRecursive(merged[index], element);
            } else {
                if (typeof element === 'string') {
                    element = element.replace('APP_NAME', sj.getApp());
                }
                merged[index] = element;
            }
        }
    };

    updateRecursive(settings, localSettings);
    sj.settings = settings;

})(window.SJ);
