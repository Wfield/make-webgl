import { create, perspective, rotate, translate, invert, m4 } from '../../lib/math.js'
import { clearCanvasToColor } from '../../lib/utils.js';
import { drawFram as drawCoord } from '../coord/main.js';
import { degToRad } from '../../lib/utils.js';

const drawDiscoRoom = (gl, programInfo, buffers, projectionMat, viewMat) => {
  gl.useProgram(programInfo.program);
  const { pos, color } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  let modelMat = create();
  modelMat = m4.translate(modelMat, -0.5, -0.5, 0.5)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
}

export const draw = (gl, programInfo, buffers, values) => {
  clearCanvasToColor(gl, [1.0, 1.0, 1.0]);

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  let caremaMat = create();
  caremaMat = m4.yRotate(caremaMat, degToRad(values['cam-rotate-y']))
  caremaMat = m4.translate(caremaMat, 0, 0, values['cam-trans-z'])
  const viewMat = create();
  invert(viewMat, caremaMat);

  drawDiscoRoom(gl, programInfo, buffers, projectionMat, viewMat)

  drawCoord(gl, projectionMat, viewMat);
}