(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerHeight * 0.5, window.innerHeight * 0.5 );

    // Add generated <canvas> to page
    var container = document.getElementById('spinningCubeContainer');
    container.appendChild( renderer.domElement );

    // Make a scene
    var scene = new THREE.Scene();

    var width = window.innerHeight * 0.5;
    var height = window.innerHeight * 0.5;

    // Create a camera
    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.z = 200;

    // Add it to the scene
    scene.add( camera );

    // Make a cube
    var cube = new THREE.Mesh(
            new THREE.CubeGeometry( 50, 50, 50 ),
            new THREE.MeshLambertMaterial( {color: 0xFF0000} ));

    // Add it to the scene
    scene.add( cube );

    // Make it spin
    function animate() {

        // Optimisation
        if( slides && slides.showAnimations[1] ) {

            // Angles are in radians
            cube.rotation.y += 0.1;

            // Re-render
            renderer.render(scene, camera);

        }

        // Call animate again once browser's ready for next frame
        requestAnimationFrame( animate )

    }

    // Start animation going
    animate();
})();
