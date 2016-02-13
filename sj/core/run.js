/**
 * Runs intial module regarding settings.
 *
 * It runs module sj.settings.init.module with function/action sj.settings.action
 *
 * @param {SJ} sj
 */
(function(sj) {
    "use strict";

    var initData = sj.settings.init;
    setTimeout(sj[initData.module][initData.action], 1);

})(window.SJ);
