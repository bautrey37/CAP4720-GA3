"use strict";

function JsonPlaneRenderable(gl, program, modelPath, modelfilename) {
    var model = parseJSON(modelPath + modelfilename);
    var texCubeObj = loadCubemap(gl, '../cubeMap/skybox/',
        ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);
    var meshDrawables = loadMeshes(gl.TRIANGLES);
    var nodeTransformations = computeNodeTrasformations();
    this.draw = function (mMatrix, lightPosition, floodFlag) {
        gl.uniform3f(program.uniformLocations["lightPosition"], lightPosition[0], lightPosition[1], lightPosition[2]);
        gl.uniform3f(program.uniformLocations["ambient"], 0.2, 0.2, 0.2); // Set the ambient light

        var mM, nM;
        var nMeshes, node;
        var nNodes = model.nodes.length;
        for (var i = 0; i < nNodes; i++) {

            mM = (mMatrix) ? new Matrix4(mMatrix) : new Matrix4();

            mM.multiply(nodeTransformations.modelT[i]);

            //mM = (mMatrix) ? (new Matrix4(mMatrix).multiply(nodeTransformations.modelT[i])) : nodeTransformations.modelT[i];
            //mM = (mMatrix) ? (new Matrix4(mMatrix).multiply(nodeTransformations.modelT[i])) : nodeTransformations.modelT[i];
            if (mMatrix) {
                nM = new Matrix4(mMatrix).multiply(nodeTransformations.normalT[i]);
                nM.elements[12] = 0;
                nM.elements[13] = 0;
                nM.elements[14] = 0;
            }
            else nM = nodeTransformations.normalT[i];

            gl.uniformMatrix4fv(program.uniformLocations["normalT"], false, nM.elements);
            node = model.nodes[i];
            nMeshes = node.meshIndices.length;

            gl.uniformMatrix4fv(program.uniformLocations["modelT"], false, mM.elements);
            for (var j = 0; j < nMeshes; j++) {
                var meshIndex = node.meshIndices[j];

                // Just draw environment map
                if (floodFlag) {
                    if (texCubeObj.complete) {
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texCubeObj);
                        gl.uniform1i(program.uniformLocations["texUnit"], 1);
                        gl.uniform1i(program.uniformLocations["drawMap"], 1);
                    }
                }

                meshDrawables[meshIndex].draw();
            }
        }
    };

    function computeNodeTrasformations() {
        var modelTransformations = [], normalTransformations = [];
        var nNodes = model.nodes.length;
        for (var i = 0; i < nNodes; i++) {
            var m = new Matrix4();
            m.elements = new Float32Array(model.nodes[i].modelMatrix);
            modelTransformations[i] = m;
            // Compute normal transformation matrix
            normalTransformations[i] = modelMatrixToNormalMatrix(m);
        }
        return {modelT: modelTransformations, normalT: normalTransformations};
    }

    function loadMeshes(drawMode) {
        // Create drawable for every mesh
        var drawables = [];
        var nMeshes = model.meshes.length;
        var attribData = [];
        var nElements = [];
        var attribLocations = [];
        var index, i;
        for (index = 0; index < nMeshes; index++) {
            var mesh = model.meshes[index];
            var attribName;
            i = 0;
            for (attribName in program.attribLocations) {
                switch (attribName) {
                    case 'position':
                        attribData[i] = mesh.vertexPositions;
                        nElements[i] = 3;
                        break;
                    case 'normal'  :
                        attribData[i] = mesh.vertexNormals;
                        nElements[i] = 3;
                        break;
                    case 'texCoord':
                        attribData[i] = (mesh.vertexTexCoordinates) ? mesh.vertexTexCoordinates[0] : undefined;
                        nElements[i] = 2;
                        break;
                    default:
                    {
                        attribData[i] = undefined;
                        nElements[i] = 1;
                    }
                }
                attribLocations[i] = program.attribLocations[attribName];
                i++;
            }
            var nVertices = mesh.vertexPositions.length / 3;
            drawables[index] = new Drawable(
                attribLocations, attribData, nElements, nVertices, mesh.indices, drawMode
            );
        }
        return drawables;
    }

    function isPowerOfTwo(x) {
        return (x & (x - 1)) == 0;
    }

    function nextHighestPowerOfTwo(x) {
        --x;
        for (var i = 1; i < 32; i <<= 1) {
            x = x | x >> i;
        }
        return x + 1;
    }

    function loadCubemap(gl, cubemappath, texturefiles) {
        var tex = gl.createTexture();
        tex.complete = false;
        loadACubeFaces(tex, cubemappath, texturefiles);
        return tex;
    }

    function loadACubeFaces(tex, cubemappath, texturefiles) {
        var imgs = [];
        var count = 6;
        for (var i = 0; i < 6; i++) {
            var img = new Image();
            imgs[i] = img;
            img.onload = function () {
                if (!isPowerOfTwo(img.width) || !isPowerOfTwo(img.height)) {
                    // Scale up the texture to the next highest power of two dimensions.
                    var canvas = document.createElement("canvas");
                    canvas.width = nextHighestPowerOfTwo(img.width);
                    canvas.height = nextHighestPowerOfTwo(img.height);
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    img = canvas;
                }
                count--;
                if (count == 0) {
                    tex.complete = true;
                    var directions = [
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                    ];
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    for (var dir = 0; dir < 6; dir++)gl.texImage2D(directions[dir], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[dir]);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                }
            }
            imgs[i].src = cubemappath + texturefiles[i];
        }
    }


    function Drawable(attribLocations, vArrays, nElements, nVertices, indexArray, drawMode) {
        // Create a buffer object
        var vertexBuffers = [];
        var nAttributes = attribLocations.length;
        for (var i = 0; i < nAttributes; i++) {
            if (vArrays[i] && (vArrays[i].length == nElements[i] * nVertices)) {
                vertexBuffers[i] = gl.createBuffer();
                if (!vertexBuffers[i]) {
                    console.log('Failed to create the buffer object');
                    return null;
                }
                // Bind the buffer object to an ARRAY_BUFFER target
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
                // Write date into the buffer object
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vArrays[i]), gl.STATIC_DRAW);
            }
            else {
                console.log('No data');
                vertexBuffers[i] = null;
            }
        }
        //console.log(nElements);
        var indexBuffer = null;
        if (indexArray) {
            indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        }
        this.delete = function () {
            if (indexBuffer) gl.deleteBuffer(indexBuffer);
            for (var i = 0; i < nAttributes; i++)
                if (vertexBuffers[i])gl.deleteBuffer(vertexBuffers[i]);
        };
        this.draw = function () {
            for (var i = 0; i < nAttributes; i++) {
                if (vertexBuffers[i]) {
                    gl.enableVertexAttribArray(attribLocations[i]);
                    // Bind the buffer object to target
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
                    // Assign the buffer object to a_Position variable
                    gl.vertexAttribPointer(attribLocations[i], nElements[i], gl.FLOAT, false, 0, 0);
                }
                else {
                    gl.disableVertexAttribArray(attribLocations[i]);
                    if (nElements[i] == 3) gl.vertexAttrib3f(attribLocations[i], 0, 0, 1);
                    else if (nElements[i] == 2) gl.vertexAttrib2f(attribLocations[i], 0, 0);
                    else alert("attribute element size different from 2 and 3");
                }
            }
            if (indexBuffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                gl.drawElements(drawMode, indexArray.length, gl.UNSIGNED_SHORT, 0);
            }
            else {
                gl.drawArrays(drawMode, 0, nVertices);
            }
        }
    }

    this.delete = function () {
        var i;
        for (i = 0; i < meshDrawables.length; i++) meshDrawables[i].delete();
        for (i = 0; i < diffuseTexObjs.length; i++) if (diffuseTexObjs[i])gl.deleteTexture(diffuseTexObjs[i]);
    };
    function modelMatrixToNormalMatrix(mat) {
        var a00 = mat.elements[0], a01 = mat.elements[1], a02 = mat.elements[2],
            a10 = mat.elements[4], a11 = mat.elements[5], a12 = mat.elements[6],
            a20 = mat.elements[8], a21 = mat.elements[9], a22 = mat.elements[10],
            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,
            d = a00 * b01 + a01 * b11 + a02 * b21,
            id;

        if (!d) {
            return null;
        }
        id = 1 / d;

        var dest = new Matrix4();

        dest.elements[0] = b01 * id;
        dest.elements[4] = (-a22 * a01 + a02 * a21) * id;
        dest.elements[8] = (a12 * a01 - a02 * a11) * id;
        dest.elements[1] = b11 * id;
        dest.elements[5] = (a22 * a00 - a02 * a20) * id;
        dest.elements[9] = (-a12 * a00 + a02 * a10) * id;
        dest.elements[2] = b21 * id;
        dest.elements[6] = (-a21 * a00 + a01 * a20) * id;
        dest.elements[10] = (a11 * a00 - a01 * a10) * id;

        return dest;
    }
}
