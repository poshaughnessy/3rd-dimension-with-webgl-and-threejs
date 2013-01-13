(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerHeight * 0.7, window.innerHeight * 0.7 );

    // Add generated <canvas> to page
    var container = document.getElementById('dinosaurRoarContainer');
    container.appendChild( renderer.domElement );

    // Make a scene
    var scene = new THREE.Scene();

    var width = window.innerHeight * 0.8;
    var height = window.innerHeight * 0.8;

    // Create a camera
    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.z = 300;

    // Add it to the scene
    scene.add( camera );

    // Lights
    var ambientLight = new THREE.AmbientLight( 0xBBBBBB );
    scene.add( ambientLight );

    var spotLight = new THREE.SpotLight(0xFFFFFF, 1.0, 2000);
    spotLight.position.set( 50, 50, 300 ); // x, y, z
    spotLight.target.position.set( 0, -100, -100 );
    scene.add( spotLight );

    // Dinosaur
    var loader = new THREE.JSONLoader();
    var model;

    var filePath = document.domain == 'pft-lon.pearson.com' ? 'models/trex/trex.js' : '../../models/trex/trex.js';

    loader.load(filePath, function(geometry) {

        model = new THREE.Mesh( geometry,
                new THREE.MeshFaceMaterial() );

        model.scale.set(10, 10, 10);
        model.position.set( 0, -100, -50 );
        model.rotation.y = Math.PI * 1.01;

        scene.add( model );

        // Model textures don't show up unless you 'animate'!
        animate();

    });

    var animate = function() {

        // Optimisation
        if( slides && slides.showAnimations[5] ) {
            renderer.render( scene, camera );
        }

        requestAnimationFrame( animate );

    };

    // Add interactivity
    var projector = new THREE.Projector();

    container.addEventListener( 'mousedown', onMouseDown, false );

    function onMouseDown( event ) {

        var canvasOffsetLeft = $(renderer.domElement).offset().left;
        var canvasOffsetTop = $(renderer.domElement).offset().top;

        event.preventDefault();

        var clickX = event.clientX - canvasOffsetLeft;
        var clickY = event.clientY - canvasOffsetTop;

        // Viewport coordinates range from -0.5 to +0.5
        var vector = new THREE.Vector3( ( clickX / width ) * 2 - 1, - ( clickY / height ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

        var intersects = ray.intersectObjects( [model] );

        if ( intersects.length > 0 ) {
            // We only have 1 object - must've clicked dinosaur
            roar();

        }
    }

    var speechBubble = document.getElementById('roarSpeechBubble');

    function roar() {

        // Recreate each time because Chrome won't replay!
        var roarSound = new Audio('media/dinosaur.mp3');
        roarSound.play();

        speechBubble.className = ''; // show
        window.setTimeout(function() {
            speechBubble.className = 'hidden';
        }, 1500);
    }

})();
