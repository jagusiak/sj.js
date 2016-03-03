window.SJ.module('input', function(sj) {
    "use strict";

    var canvas = sj.canvas.getCanvas(),
        listeners = {},
        ratioX = canvas.offsetWidth / (sj.config('canvas', 'width') || 1),
        ratioY = canvas.offsetHeight / (sj.config('canvas', 'height') || 1);

    /**
     * Attaches event related to pressing keyCode
     * @param  {String} eventName Javascript event name, ie: keydown, keyup
     * @param  {Function} listener Listens to event, one argument is passed - key code
     * @param  {Boolean} preventDefault Optional - determines if default action shoul be taken - turned of by default
     */
    function attachKeyEvent(eventName, listener, preventDefault) {
        var currentListener = listeners[eventName];
        detachKeyEvent(eventName);
        listeners[eventName] = function(event) {
            if (preventDefault) {
                event.preventDefault();
            }
            listener(event.keyCode);
        };
        document.addEventListener(eventName, listeners[eventName]);
    }
    /**
    * Attaches event related to mouse actions, ie: move, clicl
     * @param  {String} eventName Javascript event name, ie: mousemove, clik
     * @param  {Function} listener Listens to event, two argument are mouse position of action (x, y) regarding canvas size
     * @param  {Boolean} preventDefault Optional - determines if default action shoul be taken - turned of by default
     */
    function attachMouseEvent(eventName, listener, preventDefault) {
        var currentListener = listeners[eventName];
        detachMouseEvent(eventName);
        listeners[eventName] = function(event) {
            if (preventDefault) {
                event.preventDefault();
            }
            listener((event.pageX - canvas.offsetLeft )/ratioX, (event.pageY - canvas.offsetTop)/ratioY);
        };
        canvas.addEventListener(eventName, listeners[eventName]);
    }

    /**
     * Detaches event with given name
     * @param  {String} eventName
     * @param  {Object} DOM element
     */
    function detachMouseEvent(eventName) {
        var currentListener = listeners[eventName];
        if (currentListener) {
            // remove previous listener
            canvas.removeEventListener(eventName, currentListener);
            // dispose previous listener
            delete listeners[eventName];
        }
    }

    /**
     * Detaches event with given name
     * @param  {String} eventName
     * @param  {Object} DOM element
     */
    function detachKeyEvent(eventName) {
        var currentListener = listeners[eventName];
        if (currentListener) {
            // remove previous listener
            document.removeEventListener(eventName, currentListener);
            // dispose previous listener
            delete listeners[eventName];
        }
    }

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
