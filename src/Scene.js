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

        models[0].model.draw(models[0].mMatrix, models[0].Translate, lightPosition, 3, floodFlag); // Draw plane

        // Draw all shadows
        for (var i = 1; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 1, false);
        }
        // Draw all models
        for (var i = 1; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 2, false); //reflection
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 3, false); //model
        }

    };

}

