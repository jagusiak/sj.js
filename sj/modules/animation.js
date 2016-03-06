window.SJ.module('animation', function(sj) {
    "use strict";
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
