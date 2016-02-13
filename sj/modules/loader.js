window.SJ.module('loader', function(sj) {
    "use strict";

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
