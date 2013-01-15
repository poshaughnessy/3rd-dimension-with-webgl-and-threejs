(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerHeight * 0.7, window.innerHeight * 0.7 );

    // Add generated <canvas> to page
    var container = document.getElementById('firstPersonDinoContainer');
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

    // Controls
    controls = new THREE.FlyControls( camera );

    controls.movementSpeed = 30;
    controls.rollSpeed = 0.1;
    controls.dragToLook = true; // Just moving mouse shouldn't change rotation

    // Lights
    var ambientLight = new THREE.AmbientLight( 0xBBBBBB );
    scene.add( ambientLight );

    var spotLight = new THREE.SpotLight(0xFFFFFF, 1.0, 2000);
    spotLight.position.set( 50, 50, 300 ); // x, y, z
    spotLight.target.position.set( 0, -100, -100 );
    scene.add( spotLight );

    // Dinosaur
    var loader = new THREE.JSONLoader();
    var mesh;

    var clock = new THREE.Clock();

    var filePath = '../../models/trex/trex.js';

    loader.load(filePath, function(geometry) {

        mesh = new THREE.Mesh( geometry,
                new THREE.MeshFaceMaterial() );

        mesh.scale.set(10, 10, 10);
        mesh.rotation.y = Math.PI / 2;
        mesh.position.set( 0, -50, 0 );

        scene.add( mesh );

        // Model textures don't show up unless you 'animate'!
        animate();

    });

    var animate = function() {

        // Optimisation
        if( slides && slides.showAnimations[5] ) {

            renderer.render( scene, camera );

            var delta = clock.getDelta();

            controls.update(delta);

        }

        requestAnimationFrame( animate );

    };

})();