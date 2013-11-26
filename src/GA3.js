/**
 * Main javascript file
 */

"use strict";
//This function gets called when reading a JSON file. It stores the current xml information.

var floodFlag = true;
var sunAngle = 0; //degrees
var sunFlag = true;
var cameraFlag = false;
var lockCamFlag = false;
var N = [0,1,0];
var Q = [0,0,0];
var camera = null;

function toggleFloodFlag() {
    floodFlag = !floodFlag;
    document.getElementById("myCanvas1").focus();
    document.getElementById("flood").blur();
}

function toggleCamLock() {
	lockCamFlag = !lockCamFlag;
}

function changeSun(value) {
    sunAngle = Number(value);
    sunNum.innerHTML = value;
    document.getElementById("myCanvas1").focus();
    document.getElementById("sun").blur();
}

function toggleSunFlag() {
    sunFlag = !sunFlag;
    document.getElementById("myCanvas1").focus();
    document.getElementById("sunToggle").blur();
}

function addMessage(message) {
    console.log(message);
}
var camera;
function main() {
    // ... global variables ...
    var gl, canvas, model, program;
    var projMatrix, viewMatrix;
    var fov = 20;

    canvas = document.getElementById("myCanvas1");
    canvas.width = window.innerWidth - 249; //subtracts the toolbar width
    canvas.height = window.innerHeight;
    gl = getWebGLContext(canvas, false);//Disable debugging

    var keys = [];
    var i = 0;
    // Set up key listeners to move through the world.
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });

	
    program = createShaderProgram(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    var scene = new Scene();
    var dim = {};
    dim.min = [-1, -1, -1];
    dim.max = [1, 1, 1];
    camera = new Camera(gl, dim, [0, 1, 0]);
    viewMatrix = camera.getViewMatrix();
    projMatrix = camera.getProjMatrix(fov);
    initModels();
    draw();

    function initModels() {
		newModel("Plane", [0, 0, 0], 5, false);
        newModel("dabrovic-sponza", [0, 0, -2.0], 2);
        newModel("House", [0.8, -1.5, 0], 0.5);
        newModel("House", [-0.8, -1.5, 0], 0.5);
        newModel("House", [0.8, 1, 0], 0.5);
        newModel("House", [-0.8, 1, 0], 0.5);
    }
	
	function isPowerOfTwo(x) {
		return (x & (x - 1)) == 0;
	}
	
	function nextHighestPowerOfTwo(x) {
		x--;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	
    function draw() {
        gl.useProgram(program);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if(cameraFlag) {
            camera = resetCamera();
            cameraFlag = false;
        }

        projMatrix = camera.getProjMatrix(fov);
        gl.uniformMatrix4fv(program.uniformLocations["projT"], false, projMatrix.elements);

		updateCameraPos();
		viewMatrix = camera.getViewMatrix();
        gl.uniformMatrix4fv(program.uniformLocations["viewT"], false, viewMatrix.elements);

        var at = camera.getAt();
        var eye = camera.getEye();
        gl.uniform3f(program.uniformLocations["viewVec"], at[0] - eye[0], at[1] - eye[1], at[2] - eye[2]);
        scene.draw();

        gl.useProgram(null);

        window.requestAnimationFrame(draw);
    }

    function resetCamera() {
        var dim = {};
        dim.min = [-1, -1, -1];
        dim.max = [1, 1, 1];
        var camera = new Camera(gl, dim, [0, 1, 0]);
        document.getElementById("myCanvas1").focus();
        document.getElementById("camReset").blur();
        return camera;
    }

	function updateCameraPos() {
		if (keys[37]) viewMatrix = camera.panLeft(1.0);
		if (keys[39]) viewMatrix = camera.panRight(-1.0);
		if (keys[38]) viewMatrix = camera.tiltUp(0.5);
		if (keys[40]) viewMatrix = camera.tiltDown(-0.5);
		if (keys[65]) viewMatrix = camera.truckLeft(0.02);
		if (keys[68]) viewMatrix = camera.truckRight(0.02);
		if (keys[82]) viewMatrix = camera.dollyToward(0.02);
		if (keys[70]) viewMatrix = camera.dollyBack(0.02);
		if (keys[87]) viewMatrix = camera.pedestalUp(0.01);
		if (keys[83]) viewMatrix = camera.pedestalDown(0.01);
	}

    /**
     * loads in new model, will specify position here
     */
    function newModel(path, dim, relSize) {
        model = new JsonRenderable(gl, program, "../model/" + path + "/models/", "model.json");
        if (!model)alert("No model could be read");
        scene.addModel(model, dim, relSize);
    }
}