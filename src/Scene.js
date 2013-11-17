/**
 * Scene data structure that holds information about the light, camera, renderables, and floor objects.
 * It will organize all these objects so that they work together
 * @constructor
 */

function Scene(gl) {
    var models = [];

    this.addModel = function(model, dim, relSize) {
        var mMatrix = new Matrix4();
        var bounds = model.getBounds();
        var x = bounds.max[0] - bounds.min[0];
        var y = bounds.max[1] - bounds.min[1];
        var z = bounds.max[2] - bounds.min[2];
        var scale = (1/Math.max(x,y,z)) * relSize;

        //used for scaling and translation of model
        /*mMatrix.elements = new Float32Array([
            1/x, 0, 0, xLoc,
            0, 1/y, 0, 0,
            0, 0, 1/z, 0,
            0, 0, 0, 1
        ]);*/
        mMatrix.setScale(scale,scale,scale);

        models.push({mMatrix: mMatrix, Translate:[x*dim[0], y*dim[1], z*dim[2]], model: model});
    };

    this.draw = function(){
        for(var i = 0; i < models.length; i++) {
            models[i].model.draw(models[i].mMatrix, models[i].Translate);
        }
    };
}