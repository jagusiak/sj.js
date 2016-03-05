window.SJ.module('test_animation', function(sj) {
    "use strict";

    return {
        init : function() {
            var canvas = sj.canvas, scene, liu, animation, animationstates, i;
            canvas.init();
            scene = canvas.createScene('test');
            liu = scene.createObject('liu');
            sj.texture.load("liu_kang");

            liu.setPosition(0.5, 0.5, 1);
            liu.setDimension(0.1, 0.4);

            animationstates = sj.animationstates.create('liu_kang');

            animation = sj.animation.create('liu_kang_stand');
            animation.setStep(5);
            for(i = 0; i < 2; i++) {
                animation.addFrame(sj.texture.get("liu_kang"), i*0.066, 0.033, (i+1)*0.066, 0.16);
            }
            animationstates.addState('stand', animation);

            animation = sj.animation.create('liu_kang_kick');
            animation.setStep(5);
            animation.setLooped(false);
            for(i = 0; i < 2; i++) {
                animation.addFrame(sj.texture.get("liu_kang"), i*0.076 + 0.672, 0.033, (i+1)*0.076 + 0.672, 0.16);
            }
            animationstates.addState('kick', animation);

            animationstates.addTransition('kick', 'stand');

            scene.onFrame = function () {
                animationstates.play(liu);
            };

            sj.input.onKeyDown(function(key) {
                if ("kick" != animationstates.getState()) {
                    animationstates.setState("kick");
                }
            });

            canvas.start();
            canvas.loadScene('test');
        }
    };
});
