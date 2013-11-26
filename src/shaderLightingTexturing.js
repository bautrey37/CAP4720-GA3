"use strict";
function createShaderProgram(gl) {
    //get text from shader file
    function loadShaderFile(fileName) {
        var request = new XMLHttpRequest();
        request.open('GET', fileName, false);
        request.send(null);
        return request.responseText;
    }

    var VSHADER_SOURCE = loadShaderFile("shader_vertex.glsl");
    var FSHADER_SOURCE = loadShaderFile("shader_fragment.glsl");
    var program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    if (!program) {
        console.log('Failed to create program');
        return false;
    }
    var attribNames = ['position', 'normal', 'texCoord'];
    program.attribLocations = {};
    var i;
    for (i = 0; i < attribNames.length; i++) {
        program.attribLocations[attribNames[i]] = gl.getAttribLocation(program, attribNames[i]);
    }
    var uniformNames = ['modelT', 'viewT', 'projT', 'normalT', 'lightPosition', 'ambient',
        'diffuseCoeff', 'diffuseTex', 'texturingEnabled', 'viewVec', 'shinyness', 'shadowDraw'];
    program.uniformLocations = {};

    for (i = 0; i < uniformNames.length; i++) {
        program.uniformLocations[uniformNames[i]] = gl.getUniformLocation(program, uniformNames[i]);
    }
    return program;
}
