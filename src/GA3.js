/**
 * Main javascript file
 */

"use strict";
//This function gets called when reading a JSON file. It stores the current xml information.

var floodFlag = true;
var sunAngle = 32; //degrees

function toggleFloodFlag() {
    floodFlag = !floodFlag;
    document.getElementById("myCanvas1").focus();
    document.getElementById("flood").blur();
}

function changeSun(value) {
    sunAngle = value;
    sunNum.innerHTML = value;
    document.getElementById("myCanvas1").focus();
    document.getElementById("sun").blur();
}

function addMessage(message) {
    console.log(message);
}

function main() {
    // ... global variables ...
    var gl, canvas, model, camera, program;
    var projMatrix, viewMatrix;
    var fov = 32;

    canvas = document.getElementById("myCanvas1");
    //addMessage(((canvas)?"Canvas acquired":"Error: Can not acquire canvas"));
    canvas.width = window.innerWidth - 249; //subtracts the toolbar width
    canvas.height = window.innerHeight;
    gl = getWebGLContext(canvas, false);//Disable debugging

    var intervalL = null, intervalR = null, intervalU = null, intervalDo = null;
    var intervalW = null, intervalA = null, intervalS = null, intervalD = null;
    var intervalF = null;

    program = createShaderProgram(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    newModel();
    draw();
/*
    // Set up key listeners to move through the world.
    window.onkeydown =
        function (e) {
            if (e.keyCode == 37 && intervalL == null) {
                intervalL = setInterval(function () {
                    // User pressed left arrow.  Pan (Look left)
                    viewMatrix = camera.panLeft();
                }, 30);
            }
            if (e.keyCode == 39 && intervalR == null) {
                intervalR = setInterval(function () {
                    // User pressed right arrow.  Pan (Look right)
                    viewMatrix = camera.panRight();
                }, 30);
            }
            if (e.keyCode == 38 && intervalU == null) {
                intervalU = setInterval(function () {
                    // User pressed up arrow.  Tilt (Look up)
                    viewMatrix = camera.tiltUp();
                }, 30);
            }
            if (e.keyCode == 40 && intervalDo == null) {
                intervalDo = setInterval(function () {
                    // User pressed down arrow.  Tilt (Look down)
                    viewMatrix = camera.tiltDown();
                }, 30);
            }
            if (e.keyCode == 65 && intervalA == null) {
                intervalA = setInterval(function () {
                    // User pressed 'a' key. Truck (Step left)
                    viewMatrix = camera.truckLeft();
                    // The light source is always at the eye.
                    model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
                }, 30);
            }
            if (e.keyCode == 68 && intervalD == null) {
                intervalD = setInterval(function () {
                    // User pressed 'd' key. Truck (Step right)
                    viewMatrix = camera.truckRight();
                    // The light source is always at the eye.
                    model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
                }, 30);
            }
            if (e.keyCode == 82 && intervalR == null) {
                intervalR = setInterval(function () {
                    // User pressed 'r' key. Dolly (Step in)
                    viewMatrix = camera.dollyToward();
                }, 30);
            }
            if (e.keyCode == 70 && intervalF == null) {
                intervalF = setInterval(function () {
                    // User pressed 'f' key. Dolly (Step back)
                    viewMatrix = camera.dollyBack();
                }, 30);
            }
            if (e.keyCode == 87 && intervalW == null) {
                intervalW = setInterval(function () {
                    // User pressed 'w' key. Pedestal (move up)
                    viewMatrix = camera.pedestalUp();
                    model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
                }, 30);
            }
            if (e.keyCode == 83 && intervalS == null) {
                intervalS = setInterval(function () {
                    // User pressed 's' key. Pedestal (move down)
                    viewMatrix = camera.pedestalDown();
                    model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
                }, 30);
            }

            draw();
        };

    // Clear previous keydown interval.
    window.onkeyup = function (e) {
        if (e.keyCode == 37) {
            clearInterval(intervalL);
            intervalL = null;
        }
        if (e.keyCode == 39) {
            clearInterval(intervalR);
            intervalR = null;
        }
        if (e.keyCode == 38) {
            clearInterval(intervalU);
            intervalU = null;
        }
        if (e.keyCode == 40) {
            clearInterval(intervalDo);
            intervalDo = null;
        }
        if (e.keyCode == 65) {
            clearInterval(intervalA);
            intervalA = null;
        }
        if (e.keyCode == 68) {
            clearInterval(intervalD);
            intervalD = null;
        }
        if (e.keyCode == 82) {
            clearInterval(intervalR);
            intervalR = null;
        }
        if (e.keyCode == 70) {
            clearInterval(intervalF);
            intervalF = null;
        }
        if (e.keyCode == 87) {
            clearInterval(intervalW);
            intervalW = null;
        }
        if (e.keyCode == 83) {
            clearInterval(intervalS);
            intervalS = null;
        }

    };
*/
    function draw() {
        gl.useProgram(program);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(program.uniformLocations["projT"], false, projMatrix.elements);
        gl.uniformMatrix4fv(program.uniformLocations["viewT"], false, viewMatrix.elements);
        model.draw();

        gl.useProgram(null);

        window.requestAnimationFrame(draw);
    }

    /**
     * loads in new model, will specify position here
     */
    function newModel() {
        if (model) model.delete();
        var path = "House";
        //console.log(path);
        model = new JsonRenderable(gl, program, "../model/" + path + "/models/", "model.json");
        if (!model)alert("No model could be read");
        var bounds = model.getBounds();
        camera = new Camera(gl, bounds, [0, 1, 0]);
        viewMatrix = camera.getViewMatrix();
        projMatrix = camera.getProjMatrix(fov);
    }
}