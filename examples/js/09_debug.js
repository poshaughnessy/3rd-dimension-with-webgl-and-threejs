(function() {

    if( !Detector.webgl ) return;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer({antialias: true});

    var width = window.innerWidth;
    var height = window.innerHeight * 0.8;

    renderer.setSize( width, height );

    // Add generated <canvas> to page
    document.body.appendChild( renderer.domElement );

    // Make a scene
    var scene = new THREE.Scene();

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

    var sphereGeometry = new THREE.SphereGeometry( 50, 100, 100 );

    // Lambert with Material
    var sphere = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/marble.jpg')} ));

    scene.add( sphere );

    // Lights

    var ambientLight = new THREE.AmbientLight({color: 0x333333});
    scene.add(ambientLight);

    // Color, intensity, distance...
    var spotLight = new THREE.SpotLight(0xFFFFFF, 0.7, 2500);

    spotLight.position.set( 0, 50, 500 ); // x, y, z
    spotLight.target.position.set( 0, 0, 0 );

    scene.add( spotLight );

    // Render
    renderer.render(scene, camera);

})();
