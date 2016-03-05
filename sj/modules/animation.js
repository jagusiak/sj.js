window.SJ.module('animation', function(sj) {
    "use strict";
    var animations = {},
    SJAnimation = function() {
        var animation = this,
            object = o,
            step = 1,
            currentStep = 0,
            currentFrame = 0,
            frames = [],
            loopped = true,
            stopped = false;

        animation.addFrame = function(texture, left, top, right, bottom) {
            frames.push({
                texture: texture,
                left: left,
                top: top,
                right: right,
                bottom: bottom
            });
        };

        animation.setStep = function (s) {
            step = s;
        };

        animation.setLooped = function (l) {
            loopped = l;
        };

        animation.setCurrentFrame = function (f) {
            currentFrame = f | 0;
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
