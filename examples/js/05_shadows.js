(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerHeight * 0.7, window.innerHeight * 0.7 );

    // Add generated <canvas> to page
    var container = document.getElementById('spinningCubeShadowContainer');
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

    camera.position.y = -50;
    camera.position.z = 300;

    // Add it to the scene
    scene.add( camera );

    // Make a cube
    var cube = new THREE.Mesh(
            new THREE.CubeGeometry( 50, 50, 50 ),
            new THREE.MeshLambertMaterial( {color: 0xCC0000} ));

    // Add it to the scene
    scene.add( cube );

    // Cube to show shadow
    var anotherCube = new THREE.Mesh(
            new THREE.CubeGeometry( 250, 100, 250 ),
            new THREE.MeshLambertMaterial( {color: 0x666666} ));

    anotherCube.rotation.x = 1;
    anotherCube.position.set( -80, -100, -500 );

    scene.add( anotherCube );

    // Lights
    var ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( ambientLight );

    // Spotlight

    // Color, intensity, distance...
    var spotLight = new THREE.SpotLight(0xFFFFFF, 0.8, 300);

    spotLight.position.set( 50, 50, 300 ); // x, y, z
    spotLight.target.position.set( 0, 0, 0 );

    scene.add( spotLight );

    // Shadows

    // Enable globally
    renderer.shadowMapEnabled = true;

    // Enable on the spotlight
    spotLight.castShadow = true;

    // Enable on objects
    cube.castShadow = true;
    anotherCube.receiveShadow = true;

    // Render the scene from the camera
    renderer.render( scene, camera );

    // Make it spin
    function animate() {

        // Optimisation
        if( slides && slides.showAnimations[3] ) {

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
