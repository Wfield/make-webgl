import { create, perspective, rotate, translate, invert, m4, transpose } from '../../lib/math.js'
import { clearCanvasToColor } from '../../lib/utils.js';
import { drawFrame as drawCoord } from '../components/coord/main.js';
import { drawFrame as drawLightCube } from '../components/light-cube/main.js';
import { degToRad } from '../../lib/utils.js';

let r = 1.0;
let g = 1.0;
let b = 1.0;

setInterval(() => {
  r = Math.random();
  g = Math.random();
  b = Math.random();
  setTimeout(() => {
    r = 0;
    g = 0;
    b = 0;
  }, 200)
}, 2000);


const drawRoom = (gl, programInfo, buffers, projectionMat, viewMat) => {
  gl.useProgram(programInfo.program);
  const { pos, color, vertexNormal } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniform3fv(uniformLocations.lightColor, [r, g, b])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.materialColors);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
  gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexNormal);

  let modelMat = create();
  modelMat = m4.scale(modelMat, 2, 2, 2);
  modelMat = m4.translate(modelMat, -0.5, -0.5, 0.5)

  const normalMat = create();
  invert(normalMat, modelMat); // 逆矩阵
  transpose(normalMat, normalMat); // 转置矩阵
  gl.uniformMatrix4fv(uniformLocations.normalMat, false, normalMat);

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
  caremaMat = m4.xRotate(caremaMat, degToRad(values['cam-rotate-x']))
  caremaMat = m4.translate(caremaMat, 0, 0, values['cam-trans-z'])
  const viewMat = create();
  invert(viewMat, caremaMat);

  // 使用坐标组件
  // drawCoord(gl, projectionMat, viewMat);
  // 绘制灯
  drawLightCube(gl, projectionMat, viewMat);
  // 绘制当前组件
  drawRoom(gl, programInfo, buffers, projectionMat, viewMat);
}