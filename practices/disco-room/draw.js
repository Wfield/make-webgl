import { create, perspective, rotate, translate, invert } from '../../lib/math.js'
import { clearCanvasToColor } from '../../lib/utils.js';
import { drawFram as drawCoord } from '../coord/main.js';

const drawDiscoRoom = (gl, programInfo, buffers) => {
  gl.useProgram(programInfo.program);
  const { pos, color } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  // 这个矩阵是代表相机在世界坐标中的位置和姿态
  const caremaMat = create();
  const viewMat = create();
  invert(viewMat, caremaMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);


  const modelMat = create();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
}

export const draw = (gl, programInfo, buffers) => {
  clearCanvasToColor(gl, [1.0, 1.0, 1.0]);

  drawDiscoRoom(gl, programInfo, buffers)

  drawCoord(gl);
}