var scene;
var slides;

var init = function() {

    if( !Detector.webgl ) {

        // No WebGL support

        $('#noWebGL').show().addClass('show');

        slides = new Slides();

    } else {

        scene = new TREX.Scene();
        scene.animate();

        slides = new Slides(scene.updateOnSlideChange);

    }

};

// Document ready
$(function() {
    init();
});


