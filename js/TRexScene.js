TREX.Scene = function() {

    var self = this;

    // Saves having to recalculate each time
    var SIN_60 = 0.866025404;

    var NEAR = 250;
    var FAR = 100000;

    var HEIGHT_MAP_SIZE = 256;

    var FOV = 25;

    // Camera points down 45 degrees (defined in radians; to convert degrees to radians multiply by Pi/180)
    var CAMERA_ANGLE = -0.78539816339;

    var HEIGHT_MAP_IMAGE = 'heightmap/heightmap-allperiods.jpg'

    var viewport = $('#viewport');
    var scene;
    var renderer;
    var loader;
    var ambientLight;
    var heightData;
    var terrainMesh;
    var terrainMaterial;
    var waterMesh;
    var camera;
    var stats;
    var organismsLoaded = 0;

    var TARGET_MOVEMENT_STEPS = 15;
    var targetMoveStepCountdown = 0;
    var targetDeltaY = 0;


    var init = function() {

        scene = new THREE.Scene();

        scene.fog = new THREE.Fog( 0x333333, NEAR, (FAR / 2) );

        renderer = new THREE.WebGLRenderer({antialias: false, clearColor: 0x000000});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.clear();

        $(viewport).append($(renderer.domElement));

        var aspect = window.innerWidth / window.innerHeight;

        camera = new THREE.PerspectiveCamera( FOV, aspect, NEAR, FAR );

        camera.position = new THREE.Vector3( 0, 17250, 19000 ); // X, Y, Z

        camera.rotation.x = CAMERA_ANGLE;

        // Don't lock focus on lookAt position
        camera.rotationAutoUpdate = false;

        // Lighting

        ambientLight = new THREE.AmbientLight( 0xdddddd );
        scene.add( ambientLight );

        var spotlight = new THREE.SpotLight(0xFFFFFF, 0.2, 2000);
        spotlight.position.set( 2000, 1000, 1500 );
        spotlight.target.position.set( 2000, 0, 1500 );
        spotlight.castShadow = true;

        // Terrain materials

        terrainMaterial = buildTerrainMaterial();

        // Generate terrain height data from image

        var img = new Image();
        img.onload = function() {

            heightData = buildHeightData(img);
            
            var plane = new THREE.PlaneGeometry( 100, 100, HEIGHT_MAP_SIZE-1, HEIGHT_MAP_SIZE-1 );

            // XXX Is this still needed to be able to change the terrain?
            plane.dynamic = true;

            var l = plane.vertices.length;

            for( var i=0; i < l; i++ ) {
                plane.vertices[i].y = heightData[i];
            }

            terrainMesh = buildMesh(
                {geometry: plane,
                 scale: 100,
                 x: 0,
                 y: -1000,
                 z: 0,
                 material: terrainMaterial} );

            scene.add( terrainMesh );

        }

        img.src = HEIGHT_MAP_IMAGE;

        // Water
        var water = new THREE.PlaneGeometry( 100, 100, 1, 1 ); // width, height, segmentsWidth, segmentsHeight

        waterMesh = buildMesh(
            {geometry: water,
             scale: 75,
             x: 1250,
             y: -565,
             z: 0,
             material: buildWaterMaterial()} );

        scene.add( waterMesh );

        loader = new THREE.JSONLoader();

        setUpOrganisms();

        scene.add(camera);

        addStats();

        window.addEventListener( 'resize', onWindowResize, false );

    };

    var setUpOrganisms = function() {

        for( var key in TREX.organisms ) {

            var organism = TREX.organisms[key];

            // Load model
            loadOrganismModel( organism );
        }

    };

    var loadOrganismModel = function(organism) {

        var filepath = 'models/'+organism.modelFile;

        loader.load( filepath, function ( geometry ) {

            geometry.materials[0].shading = THREE.FlatShading;

            var faceMaterial = new THREE.MeshFaceMaterial();

            var model = new THREE.Mesh(geometry, faceMaterial);

            var modelScale = organism.modelScale || 1;

            model.scale.set(modelScale, modelScale, modelScale);

            var modelYRotation = Math.PI / 2;

            if( typeof organism.modelYRotation !== 'undefined' ) {
                modelYRotation = organism.modelYRotation;
            }

            model.rotation.y = modelYRotation;

            model.position.set(
                organism.position.x,
                organism.position.y,
                organism.position.z
            );

            scene.add( model );

            organism.model = model;

            organismsLoaded++;

        });

    };

    var addStats = function() {

        stats = new Stats();

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '0px';

        document.body.appendChild( stats.domElement );

    };

    var buildMesh = function(config) {

        var mesh = new THREE.Mesh( config.geometry, config.material );

        mesh.scale.x = config.scale;
        mesh.scale.y = config.scale;
        mesh.scale.z = config.scale;

        mesh.position.x = config.x;
        mesh.position.y = config.y;
        mesh.position.z = config.z;

        mesh.overdraw = true;
        mesh.doubleSided = false;
        mesh.updateMatrix();

        return mesh;

    };

    var buildHeightData = function(img) {

        var canvas = document.createElement('canvas');

        canvas.width = HEIGHT_MAP_SIZE;
        canvas.height = HEIGHT_MAP_SIZE;

        var context = canvas.getContext('2d');

        var size = HEIGHT_MAP_SIZE * HEIGHT_MAP_SIZE;
        var data = new Float32Array( size );

        context.drawImage( img, 0, 0 );

        // XXX Why does it initialise to 0?
        for( var i=0; i < size; i++ ) {
            data[i] = 0;
        }

        var imgData = context.getImageData(0, 0, HEIGHT_MAP_SIZE, HEIGHT_MAP_SIZE);

        var pix = imgData.data;

        var j = 0;

        // XXX Go through and comment what this is doing
        var n = pix.length;

        for( var i=0; i < n; i += 4) {

            var all = pix[i] + pix[i+1] + pix[i+2];
            data[j++] = all/50; // Factor it down

        }

        return data;

    };

    var buildTerrainMaterial = function() {

        var terrainTexture = THREE.ImageUtils.loadTexture('textures/terrain-All Periods.jpg');

        var terrainMaterial = new THREE.MeshPhongMaterial( {map: terrainTexture, color: 0xffffff, ambient: 0xffffff,
            specular: 0xffffff, shininess: 0, shading: THREE.SmoothShading} );

        return terrainMaterial;

    };

    var buildWaterMaterial = function() {

        var waterTexture = THREE.ImageUtils.loadTexture('textures/water.jpg');

        var waterMaterial = new THREE.MeshPhongMaterial( {map: waterTexture, ambient: 0xffffff, specular: 0xffffff,
            reflectivity: 0.95, opacity: 0.5, shininess: 50, shading: THREE.SmoothShading, transparent: true,
            combine: THREE.Mix} );

        return waterMaterial;

    };

    // XXX refactor to use this method in the first place when initial terrain is created?
    var updateTerrainFromHeightData = function() {

        var l = terrainMesh.geometry.vertices.length;

        for( var i=0; i < l; i++ ) {
            terrainMesh.geometry.vertices[i].y = heightData[i];
        }

        terrainMesh.geometry.verticesNeedUpdate = true;

    };

    // Initially called by the bootstrap code to kick everything off
    this.animate = function() {

        requestAnimationFrame( self.animate );

        if( targetMoveStepCountdown > 0 ) {

            var yToMove = targetDeltaY / TARGET_MOVEMENT_STEPS;

            if( Math.abs( Math.round(yToMove) ) > 0 ) camera.translateZ( yToMove / SIN_60 );

            if( targetMoveStepCountdown > 0 ) targetMoveStepCountdown--;

        }

        render();

        if( stats ) stats.update();

    };

    var render = function() {

        renderer.render(scene, camera);

    };

    var onWindowResize = function(event) {

        renderer.setSize( window.innerWidth, window.innerHeight );

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

    };

    /*
     * Range from 20000 to 1000
     */
    this.updateOnSlideChange = function(slideNumber, totalSlides, immediate) {

        var targetY = 20000 - (19000 * ((slideNumber-1) / (totalSlides-1)));

        targetDeltaY = targetY - camera.position.y;

        if( immediate ) {

            camera.translateZ( targetDeltaY / SIN_60 );

        } else {

            if( targetDeltaY !== 0 ) {
                targetMoveStepCountdown = TARGET_MOVEMENT_STEPS;
            }

        }

    };

    init();

}
