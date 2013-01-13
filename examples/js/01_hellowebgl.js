var canvas = document.getElementById('triangleCanvas');

canvas.width = window.innerHeight * 0.7;
canvas.height = window.innerHeight * 0.7;

// Get WebGL canvas context
try {

    var gl = canvas.getContext('webgl') ||
             canvas.getContext('experimental-webgl');

} catch(e) {
}

if( gl ) {

    var vertexPosBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

    // Vertices for triangle
    /*
     2 (0, 0.5)
     /\
     /  \
     (-0.5, -0.5) 0 /____\ 1 (0.5, -0.5)
     */
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0, 0.5
    ];

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

    // Shader code (GLSL)

    var vertexShaderSource = 'attribute vec2 pos;' +
            'void main() {' +
            '  gl_Position = vec4(pos, 0, 1);' + // xyz(w)
            '}';

    var fragmentShaderSource = 'precision mediump float;' +
            'void main() {' +
            '  gl_FragColor = vec4( 0, 1.0, 0, 1);' + // rgba
            '}';

    // Create shaders

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource( vertexShader, vertexShaderSource );
    gl.compileShader( vertexShader );

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource( fragmentShader, fragmentShaderSource );
    gl.compileShader( fragmentShader );

    // Create program

    var program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );

    gl.useProgram(program);

    // Hook up buffer to program input
    program.vertexPosAttrib = gl.getAttribLocation( program, 'pos' );

    // Tell it to read buffer when we start drawing
    gl.enableVertexAttribArray( program.vertexPosAttrib );

    // Specify how program should read data from buffer
    gl.vertexAttribPointer( program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0 );

    // Draw!
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}
