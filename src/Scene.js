/**
 * Scene data structure that holds information about the light, camera, renderables, and floor objects.
 * It will organize all these objects so that they work together
 * @constructor
 */

function Scene() {
    var models = [];
    var lightDistance = 20;
    var lightPosition = [0, 0, 0];

    this.addModel = function (model, dim, relSize) {
        var mMatrix = new Matrix4();
        var bounds = model.getBounds();
        var x = bounds.max[0] - bounds.min[0];
        var y = bounds.max[1] - bounds.min[1];
        var z = bounds.max[2] - bounds.min[2];
        var scale = (1 / Math.max(x, y, z)) * relSize;
        mMatrix.setScale(scale, scale, scale);

        var dy = 0 - bounds.min[1];
        models.push({mMatrix: mMatrix, Translate: [x * dim[0], y * dim[1] + dy, z * dim[2]], model: model});
    };

    this.draw = function () {
        //sunAngle is global and can be changed from html
        lightPosition[0] = lightDistance * Math.cos(sunAngle * Math.PI / 180);
        lightPosition[1] = lightDistance * Math.sin(sunAngle * Math.PI / 180);
        lightPosition[2] = 2;

        if (lockCamFlag) {
            camera.setEye(lightPosition);
            camera.setAt([0, 0, 0]);
        }

        if (sunFlag) sunAngle += 0.5;  //degrees
        if (sunAngle > 360) sunAngle = 0;
        sunNum.innerHTML = sunAngle.toFixed(1).toString();
        document.getElementById("sun").value = sunAngle;

        models[0].model.draw(models[0].mMatrix, models[0].Translate, lightPosition, false); // Draw plane

        // Draw all shadows
        for (var i = 1; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, true);
        }
        // Draw all models
        for (var i = 1; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, false);
        }

    };

    function reflectionMatrix(min) {
        var N = [0,1,0];
        var Q = min; //a point on plane
        var NdotQ = dot(N,Q);

        reflectionMatrix.elements = new Float32Array([
            1-2*N[0]*N[0],-2*N[1]*N[0],-2*N[2]*N[0],0,
            -2*N[0]*N[1],1-2*N[1]*N[1],-2*N[2]*N[1],0,
            -2*N[0]*N[2],-2*N[1]*N[2],1-2*N[2]*N[2],0,
            2*NdotQ*N[0],2*NdotQ*N[1],2*NdotQ*N[2],1
        ]);
    }
}

function dot(N,Q) {
    var res = 0;
    for(var i = 0; i < 3; i++) {
        res = res + N[i] * Q[i];
    }
    return res;
}