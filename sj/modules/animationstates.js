window.SJ.module('animationstates', function(sj) {
    "use strict";
    var animationStates = {},
    SJAnimationStates = function (s, t) {
        var states, transitions, currentState, animationStates = this;

        animationStates.addState = function(name, animation) {
            if (states[name]) {
                throw new Error("Animation state with name '" + name + "' already exists");
            }

            if (!currentState) {
                animationStates.setState(name);
            }

            states[name] = animation;
        };

        animationStates.addStates = function(data) {
            for (var name in data) {
                animationStates.addState(name, data[name]);
            }
        };

        animationStates.addTransition = function(fromState, toState) {
            if (!states[fromState]) {
                throw new Error("Animation state with name '" + fromState + "' doesn't exist");
            }

            if (!states[toState]) {
                throw new Error("Animation state with name '" + toState + "' doesn't exist");
            }

            transitions[fromState] = toState;
        };

        animationStates.addTransitions = function(data) {
            for (var name in data) {
                animationStates.addTransition(name, data[name]);
            }
        };

        animationStates.setState = function(name, frame) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exist");
            }
            currentState = name;

            states[name].setCurrentFrame(frame || 0);
        };

        animationStates.play = function(object) {
            var currentAnimation = states[currentState];
            if(currentAnimation.hasStopped()) {
                var newState = transitions[currentState];
                if (newState) {
                    animationStates.setState(currentState);
                    currentAnimation = states[newState];
                }
            }
            currentAnimation.play();
        };

        animationStates.addStates(s || {});
        animationStates.addTransitions(t || {});
    };

    return {
        create: function(name) {
            if (animationStates[name]) {
                throw new Error("Animation states with name '" + name +  "' already exists");
            }
            animationStates[name] = new SJAnimationStates();
            return animationStates[name];
        },
        destroy : function(name) {
            delete animationStates[name];
        },
        get : function(name) {
            return animationStates[name];
        }
    };

});
