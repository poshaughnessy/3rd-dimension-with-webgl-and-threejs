(function() {
    var camera;
    var webglScene, webglRenderer;

    var loader;

    var robot = {};

    var FOV = 50;
    var NEAR = 1;
    var FAR = 10000;

    var RAD_20 = Math.PI / 9;
    var RAD_30 = Math.PI / 6;
    var RAD_45 = Math.PI / 4;
    var RAD_360 = Math.PI * 2;

    init();

    function init() {

        if( !Detector.webgl ) {
            document.getElementById('noWebGL').style.display = 'block';
            return;
        }

        var width = window.innerWidth;
        var height = window.innerHeight;

        camera = new THREE.PerspectiveCamera( FOV, width / height, NEAR, FAR );
        camera.position.set( 0, 500, 1000 );
        camera.lookAt( new THREE.Vector3(0, 100, -500) );

        //

        webglScene = new THREE.Scene();

        webglRenderer = new THREE.WebGLRenderer({ antialias: true });
        webglRenderer.setSize( width, height );
        webglRenderer.domElement.style.position = 'absolute';
        webglRenderer.domElement.style.top = 0;
        document.getElementById('tweenContainer').appendChild( webglRenderer.domElement );

        // Lighting

        var directionalLight = new THREE.DirectionalLight( 0xeeeeff, 0.2 );
        directionalLight.position.set(0, 0, 1);
        webglScene.add( directionalLight );

        var downLight = new THREE.DirectionalLight( 0xeeeeff, 0.2 );
        downLight.position.set(0, 1, 0);
        webglScene.add( downLight );

        var spotlight1 = new THREE.SpotLight(0xFFFFFF, 1.0, 5000);
        spotlight1.position.set( 0, 3500, 500 );
        spotlight1.target.position.set( 0, 0, 0 );
        spotlight1.castShadow = true;
        spotlight1.shadowCameraNear = 1; // keep near and far planes as tight as possible
        spotlight1.shadowCameraFar = 5000; // shadows not cast past the far plane
        webglScene.add( spotlight1 );


        // Robot

        loader = new THREE.ColladaLoader();

        /* Robot from 'WebGL: Up & Running Book' - licence applies, but it no longer appears */
        /* to be up at the URL referenced in the book (turbosquid.com/FullPreview/Index.cfm/ID/475463) */
        /* (It now redirects to another robot). If you're the creator of the model, please get in  */
        /* touch with me and I'll happily pay to use it (or replace it if you prefer). Thanks! */
        loader.load( '../models/robot/robot_cartoon_02.dae', function( collada ) {

            var model = collada.scene;
            model.position.set(1000, 0, -500);
            model.rotation.y = Math.PI / 4;

            robot.model = model;

            robot.key = model.getChildByName('ID65', true);
            robot.head = model.getChildByName('ID139', true);
            robot.leftLeg = model.getChildByName('ID93', true);
            robot.rightLeg = model.getChildByName('ID75', true);
            robot.leftArm = model.getChildByName('ID376', true);
            robot.rightArm = model.getChildByName('ID294', true);

            // Right arm is not quite in the right place for some reason
            robot.rightArm.position.z -= 20;

            setUpRobotAnimations();

            webglScene.add( model );


        });

        animate();

    }

    function setUpRobotAnimations() {

        // Need to set this to allow us to change rotation of child elements
        robot.key.useQuaternion = false;
        robot.head.useQuaternion = false;
        robot.leftLeg.useQuaternion = false;
        robot.rightLeg.useQuaternion = false;
        robot.leftArm.useQuaternion = false;
        robot.rightArm.useQuaternion = false;


        var tweenKeyTurn = new TWEEN.Tween( robot.key.rotation )
                .to( { x: robot.key.rotation.x - (RAD_360) }, 3000)
                .onComplete(function() {
                    robot.key.rotation.x = 0;
                });

        var tweenHeadTurn = new TWEEN.Tween( robot.head.rotation )
                .to( { y: robot.head.rotation.y + (RAD_30) }, 3000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenHeadTurnBack = new TWEEN.Tween( robot.head.rotation )
                .to( { y: robot.head.rotation.y - (RAD_30) }, 3000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenLeftLegForwards = new TWEEN.Tween( robot.leftLeg.rotation )
                .to( { z: robot.leftLeg.rotation.z - (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenLeftLegBackwards = new TWEEN.Tween( robot.leftLeg.rotation )
                .to( { z: robot.leftLeg.rotation.z + (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenRightLegForwards = new TWEEN.Tween( robot.rightLeg.rotation )
                .to( { z: robot.rightLeg.rotation.z - (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenRightLegBackwards = new TWEEN.Tween( robot.rightLeg.rotation )
                .to( { z: robot.rightLeg.rotation.z + (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenLeftArmForwards = new TWEEN.Tween( robot.leftArm.rotation )
                .to( { z: robot.leftArm.rotation.z - (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenLeftArmBackwards = new TWEEN.Tween( robot.leftArm.rotation )
                .to( { z: robot.leftArm.rotation.z + (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenRightArmForwards = new TWEEN.Tween( robot.rightArm.rotation )
                .to( { z: robot.rightArm.rotation.z - (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenRightArmBackwards = new TWEEN.Tween( robot.rightArm.rotation )
                .to( { z: robot.rightArm.rotation.z + (RAD_20) }, 1000 )
                .easing( TWEEN.Easing.Quadratic.InOut );


        var tweenTurnBack = new TWEEN.Tween( robot.model.rotation )
                .to( { y: robot.model.rotation.y + (RAD_45) }, 3000 )
                .easing( TWEEN.Easing.Quadratic.InOut );

        var tweenWalkToCentre = new TWEEN.Tween( robot.model.position )
                .to( { x: 0, z: 300 }, 10000 )
                .onComplete(function() {
                    tweenTurnBack.start();
                });


        tweenKeyTurn.chain( tweenKeyTurn );

        tweenHeadTurn.chain( tweenHeadTurnBack );
        tweenHeadTurnBack.chain( tweenHeadTurn );

        tweenLeftLegForwards.chain( tweenLeftLegBackwards );
        tweenLeftLegBackwards.chain( tweenLeftLegForwards );

        tweenRightLegForwards.chain( tweenRightLegBackwards );
        tweenRightLegBackwards.chain( tweenRightLegForwards );

        tweenLeftArmForwards.chain( tweenLeftArmBackwards );
        tweenLeftArmBackwards.chain( tweenLeftArmForwards );

        tweenRightArmForwards.chain( tweenRightArmBackwards );
        tweenRightArmBackwards.chain( tweenRightArmForwards );

        tweenKeyTurn.start();
        tweenHeadTurn.start();
        tweenLeftLegForwards.start();
        tweenRightLegBackwards.start();
        tweenLeftArmForwards.start();
        tweenRightArmBackwards.start();

        tweenWalkToCentre.start();

    }

    function animate() {

        requestAnimationFrame( animate );

        // Optimisation
        if( slides && slides.showAnimations[7] ) {

            TWEEN.update();

            if( robot.model != undefined ) {
                robot.model.updateMatrix();
                robot.model.matrixWorldNeedsUpdate = true;
            }

            webglRenderer.render( webglScene, camera );

        }

    }
})();
