/**
 * Scene data structure that holds information about the light, camera, renderables, and floor objects.
 * It will organize all these objects so that they work together
 * @constructor
 */

function Scene() {
    var models = [];
    var lightDistance = 20;
    var lightPosition = [0,0,0];

    this.addModel = function(model, dim, relSize) {
        var mMatrix = new Matrix4();
        var bounds = model.getBounds();
        var x = bounds.max[0] - bounds.min[0];
        var y = bounds.max[1] - bounds.min[1];
        var z = bounds.max[2] - bounds.min[2];
        var scale = (1/Math.max(x,y,z)) * relSize;
        mMatrix.setScale(scale,scale,scale);

		var dy = 0 - bounds.min[1];
        models.push({mMatrix: mMatrix, Translate:[x*dim[0], y*dim[1] + dy, z*dim[2]], model: model});
    };

    this.draw = function(){
        //sunAngle is global and can be changed from html
        lightPosition[0] = lightDistance * Math.cos(sunAngle * Math.PI/180);
        lightPosition[1] = lightDistance;
        lightPosition[2] = lightDistance * Math.sin(sunAngle * Math.PI/180);
		
		if (lockCamFlag) {
			camera.setEye(lightPosition);
			camera.setAt([0,0,0]);
		}
		
        if(sunFlag) sunAngle += 0.5;  //degrees
        if(sunAngle > 360) sunAngle = 0;
        sunNum.innerHTML = sunAngle.toFixed(1).toString();
        document.getElementById("sun").value = sunAngle;

        models[0].model.draw(models[0].mMatrix, models[0].Translate, lightPosition, false); // Draw plane
		// Draw houses with shadows
		//for (var i=1; i<models.length; i++) {
		models[1].model.draw(models[1].mMatrix, models[1].Translate, lightPosition, true, 0); // 0 = no rotation
		models[2].model.draw(models[2].mMatrix, models[2].Translate, lightPosition, true, 1); // 1 = rotate -90 degrees
		models[3].model.draw(models[3].mMatrix, models[3].Translate, lightPosition, true, 1);
		models[4].model.draw(models[4].mMatrix, models[4].Translate, lightPosition, true, 2); // 2 = rotate 90 degrees
		models[5].model.draw(models[5].mMatrix, models[5].Translate, lightPosition, true, 2);
		
		models[1].model.draw(models[1].mMatrix, models[1].Translate, lightPosition, false, 0);
		models[2].model.draw(models[2].mMatrix, models[2].Translate, lightPosition, false, 1);
		models[3].model.draw(models[3].mMatrix, models[3].Translate, lightPosition, false, 1);
		models[4].model.draw(models[4].mMatrix, models[4].Translate, lightPosition, false, 2);
		models[5].model.draw(models[5].mMatrix, models[5].Translate, lightPosition, false, 2);
		
    };
}