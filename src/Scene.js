/**
 * Scene data structure that holds information about the light, camera, renderables, and floor objects.
 * It will organize all these objects so that they work together
 * @constructor
 */

function Scene() {
    var models = [];
    var plane = {};
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

    this.addPlane = function(object, relSize) {
        var mMatrix = new Matrix4();
        mMatrix.setScale(relSize, relSize, relSize);

        plane = {mMatrix: mMatrix, object: object};
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

        if (sunFlag) sunAngle += 1.0;  //degrees
        if (sunAngle > 180) sunAngle = 0;
        sunNum.innerHTML = sunAngle.toFixed(1).toString();
        document.getElementById("sun").value = sunAngle;

        plane.object.draw(plane.mMatrix, lightPosition, 3); // Draw plane


        // Draw all shadows
        for (var i = 0; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 1);
        }
        // Draw all models
        for (var i = 0; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 2); //reflection
            models[i].model.draw(models[i].mMatrix, models[i].Translate, lightPosition, 3); //model
        }

    };

}

