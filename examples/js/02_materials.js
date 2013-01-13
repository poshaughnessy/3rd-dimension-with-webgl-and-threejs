(function() {

    if( !Detector.webgl ) return;

    var width = window.innerWidth;
    var height = window.innerHeight * 0.8;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize( width, height );

    // Add generated <canvas> to page
    var container = document.getElementById('materialsContainer');
    container.appendChild( renderer.domElement );

    // Make a scene
    var scene = new THREE.Scene();

    // Create a camera
    var camera = new THREE.PerspectiveCamera(
            45,           // Field of View
            width/height, // Aspect ratio
            1,            // zNear
            10000         // zFar
    );

    camera.position.y = -100;
    camera.position.z = 520;

    // Add it to the scene
    scene.add( camera );

    // Basic
    var sphereBasic = new THREE.Mesh(
            new THREE.SphereGeometry( 50, 100, 100 ),
            new THREE.MeshBasicMaterial( {color: 0x00509F} ));

    sphereBasic.position.x = -300;

    // Lambert
    var sphereLambert = new THREE.Mesh(
            new THREE.SphereGeometry( 50, 100, 100 ),
            new THREE.MeshLambertMaterial( {color: 0x00509F} ));

    sphereLambert.position.x = -150;

    // Phong
    var spherePhong = new THREE.Mesh(
            new THREE.SphereGeometry( 50, 100, 100 ),
            new THREE.MeshPhongMaterial( {
                color: 0x00509F,
                specular: 0xFFFFFF,
                shading: THREE.SmoothShading,
                shininess: 50,
                fog: false,
                metal: true} ));

    spherePhong.position.x = 0;

    // Lambert with Material
    var textureFilePath = (insideExamples ? '' : 'examples/') + 'textures/marble.jpg';
    var sphereLambertMaterial = new THREE.Mesh(
            new THREE.SphereGeometry( 50, 100, 100 ),
            new THREE.MeshLambertMaterial( {color: 0xFFFFFF, map: THREE.ImageUtils.loadTexture(textureFilePath, {}, function() {
                // Postponing rendering until image has loaded
                animate();
            })} ));

    sphereLambertMaterial.position.x = 150;

    var uniforms = {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() }
    };

    var sphereShader = new THREE.Mesh(
            new THREE.SphereGeometry( 50, 100, 100 ),
            new THREE.ShaderMaterial( {
                vertexShader: document.getElementById( 'vertex_shader' ).textContent,
                fragmentShader: document.getElementById( 'fragment_shader' ).textContent,
                uniforms: uniforms } ));

    sphereShader.position.x = 300;


    // Add them to the scene
    scene.add( sphereBasic );
    scene.add( sphereLambert );
    scene.add( spherePhong );
    scene.add( sphereLambertMaterial );
    scene.add( sphereShader );

    // Text

    var textBasic = generateText('Basic');
    var textLambert = generateText('Lambert');
    var textPhong = generateText('Phong');
    var textLambertMaterial = generateText('Texture');
    var textShader = generateText('Shader');

    var centreOffset = 0.5 * (textBasic.geometry.boundingBox.max.x - textBasic.geometry.boundingBox.min.x);
    textBasic.position.x = -300 -centreOffset;
    textBasic.position.y = -100;

    centreOffset = 0.5 * (textLambert.geometry.boundingBox.max.x - textLambert.geometry.boundingBox.min.x);
    textLambert.position.x = -150 -centreOffset;
    textLambert.position.y = -100;

    centreOffset = 0.5 * (textPhong.geometry.boundingBox.max.x - textPhong.geometry.boundingBox.min.x);
    textPhong.position.x = -centreOffset;
    textPhong.position.y = -100;

    centreOffset = 0.5 * (textLambertMaterial.geometry.boundingBox.max.x - textLambertMaterial.geometry.boundingBox.min.x);
    textLambertMaterial.position.x = 150 -centreOffset;
    textLambertMaterial.position.y = -100;

    centreOffset = 0.5 * (textShader.geometry.boundingBox.max.x - textShader.geometry.boundingBox.min.x);
    textShader.position.x = 300 -centreOffset;
    textShader.position.y = -100;

    scene.add( textBasic );
    scene.add( textLambert );
    scene.add( textPhong );
    scene.add( textLambertMaterial );
    scene.add( textShader );

    // Lights

    var ambientLight = new THREE.AmbientLight({color: 0x333333});
    scene.add(ambientLight);

    // Color, intensity, distance...
    var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.7, 2500);
    var spotLight3 = new THREE.SpotLight(0xFFFFFF, 0.4, 2500);

    spotLight2.position.set( 150, 50, 500 ); // x, y, z
    spotLight2.target.position.set( 150, 0, 0 );

    spotLight3.position.set( 300, 50, 500 ); // x, y, z
    spotLight3.target.position.set( 150, 0, 0 );

    scene.add( spotLight2 );
    scene.add( spotLight3 );



    function animate() {

        // Optimisation
        if( slides && slides.showAnimations[0] ) {

            uniforms.time.value += 0.05;

            renderer.render(scene, camera);

        }

        requestAnimationFrame(animate);

    }

    function generateText(string) {

        var text3d = new THREE.TextGeometry( string, {

            size: 10,
            height: 1,
            curveSegments: 10,
            font: 'helvetiker'

        });

        text3d.computeBoundingBox();

        var textMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, overdraw: true } );

        var text = new THREE.Mesh( text3d, textMaterial );

        text.doubleSided = false;

        return text;

    }

})();
