window.SJ.module('test_hittest', function(sj) {
    "use strict";

    return {
        init : function() {
            // var
            //     test,
            //     hittest = sj.hittest.create(0, 0, 1, 1, 3,3);
            // for (var i = 0; i < 10; i++) {
            //     var object = sj.canvasobject.create('test_' + i);
            //     object.setPosition(0.3, 0.1*i);
            //     object.setDimension(0.1, 0.1);
            //     hittest.put(object);
            // }
            // test = sj.canvasobject.create('test');
            // test.setPosition(0.31,0.11);
            // test.setDimension(0.05,0.05);
            // console.log(hittest.test(test));
            // hittest.recalculate();
            // console.log(hittest.test(test));
            //


            var canvas = sj.canvas, scene, animation, animationstates, cursor, i, hitest = sj.hittest.create(0, 0, 1, 1.5, 3,3);

            canvas.init();
            sj.texture.load("dr_mario");
            scene = canvas.createScene('test');

            animationstates = sj.animationstates.create('dr_mario');

            animation = sj.animation.create('dr_mario');
            animation.setStep(5);
            for(i = 0; i < 3; i++) {
                animation.addFrame(sj.texture.get("dr_mario"), i*0.33, 0.0, (i+1)*0.33, 1.0);
            }
            animationstates.addState('stand', animation);

            for (var t = 0; t < 10; t++) {
                var mario = scene.createObject('mario_' + t);
                mario.setPosition(Math.random(), Math.random(), 2);
                mario.setDimension(0.1, 0.2);
                mario.setTexture(sj.texture.get('dr_mario'), 0, 0, 0.33, 1);
                hitest.put(mario);
            }

            cursor = scene.createObject('cursor');
            cursor.setPosition(Math.random(), Math.random(), 1);
            cursor.setDimension(0.1, 0.2);
            cursor.setTexture(sj.texture.get('dr_mario'), 0, 0, 0.33, 1);

            sj.input.onMouseMove(function(x,y){
                cursor.setPosition(x, y, 1);
            });

            scene.onFrame = function () {
                var test = hitest.test(cursor);
                for (var i in test) {
                    animationstates.play(test[i]);
                }
            };

            canvas.start();
            canvas.loadScene('test');
        }
    };
});
