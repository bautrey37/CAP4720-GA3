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

    var scene = new Scene(gl);
    initModels();
    draw();

    function initModels() {
        newModel("Shrine", 0, 0);
        //and other models
    }

    function draw() {
        gl.useProgram(program);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(program.uniformLocations["projT"], false, projMatrix.elements);
		
		// Update camera position based on key presses every two loops.
		if (i == 2) {
			i=0;
			updateCameraPos();
		}
		i++;
        gl.uniformMatrix4fv(program.uniformLocations["viewT"], false, viewMatrix.elements);
        //model.draw();
        scene.draw();

        gl.useProgram(null);

        window.requestAnimationFrame(draw);
    }
	
	function updateCameraPos() {
		if (keys[37]) viewMatrix = camera.panLeft();
		if (keys[39]) viewMatrix = camera.panRight();
		if (keys[38]) viewMatrix = camera.tiltUp();
		if (keys[40]) viewMatrix = camera.tiltDown();
		if (keys[65]) viewMatrix = camera.truckLeft();
		if (keys[68]) viewMatrix = camera.truckRight();
		if (keys[82]) viewMatrix = camera.dollyToward();
		if (keys[70]) viewMatrix = camera.dollyBack();
		if (keys[87]) viewMatrix = camera.pedestalUp();
		if (keys[83]) viewMatrix = camera.pedestalDown();
	}

    /**
     * loads in new model, will specify position here
     */
    function newModel(path, xLoc, zLoc) {
        model = new JsonRenderable(gl, program, "../model/" + path + "/models/", "model.json");
        if (!model)alert("No model could be read");
        var bounds = model.getBounds();
        camera = new Camera(gl, bounds, [0, 1, 0]);
        viewMatrix = camera.getViewMatrix();
        projMatrix = camera.getProjMatrix(fov);
        scene.addModel(model, xLoc, zLoc);
    }
}