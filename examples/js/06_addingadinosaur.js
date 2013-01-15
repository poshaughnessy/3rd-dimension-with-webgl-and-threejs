(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerHeight * 0.7, window.innerHeight * 0.7 );

    // Add generated <canvas> to page
    var container = document.getElementById('dinosaurContainer');
    container.appendChild( renderer.domElement );

    // Make a scene
    var scene = new THREE.Scene();

    var width = window.innerHeight * 0.7;
    var height = window.innerHeight * 0.7;

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
    var mesh;

    var filePath = '../../models/trex/trex.js';

    loader.load(filePath, function(geometry) {

        mesh = new THREE.Mesh( geometry,
                new THREE.MeshFaceMaterial() );

        mesh.scale.set(10, 10, 10);
        mesh.position.set( 0, -50, -300 );

        scene.add( mesh );

        // Model textures don't show up unless you 'animate'!
        animate();

    });

    var animate = function() {

        // Optimisation
        if( slides && slides.showAnimations[4] ) {

            mesh.rotation.y += 0.05;
            renderer.render( scene, camera );

        }

        requestAnimationFrame( animate );

    };

})();
