window.SJ.module('animationstates', function(sj) {
    "use strict";
    var animationStates = {},
    SJAnimationStates = function (s, t) {
        var states= {}, transitions = {}, currentState, stateExit = {}, stateEnter = {}, animationStates = this;

        animationStates.addState = function(name, animation) {
            if (states[name]) {
                throw new Error("Animation state with name '" + name + "' already exists");
            }

            states[name] = animation;

            if (!currentState) {
                animationStates.setState(name);
            }
        };

        animationStates.addStates = function(data) {
            for (var name in data) {
                animationStates.addState(name, data[name]);
            }
        };

        animationStates.onStateExit = function(name, action) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exists");
            }

            stateExit[name] = action;
        };

        animationStates.detachStateExit = function(name, action) {
            delete stateExit[name];
        };

        animationStates.detachAllStateExit = function() {
            for (var name in stateExit) {
                animationStates.detachStateExit(name);
            }
        };

        animationStates.onStateEnter = function(name) {
            if (!states[name]) {
                throw new Error("Animation state with name '" + name + "' doesn't exists");
            }

            stateEnter[name] = action;
        };

        animationStates.detachStateEnter = function(name) {
            delete stateEnter[name];
        };

        animationStates.detachAllStateEnter = function() {
            for (var name in stateEnter) {
                animationStates.detachStateEnter(name);
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

            if (stateExit[currentState]) {
                stateExit[name]();
            }

            currentState = name;

            if (stateEnter[currentState]) {
                stateExit[name]();
            }

            states[name].setCurrentFrame(frame || 0);
        };

        animationStates.getState = function(name, frame) {
            return currentState;
        };

        animationStates.play = function(object) {
            var currentAnimation = states[currentState];
            if(currentAnimation.hasStopped()) {

                var newState = transitions[currentState];
                if (newState) {
                    animationStates.setState(newState);
                    currentAnimation = states[newState];
                }

            }
            currentAnimation.play(object);
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
