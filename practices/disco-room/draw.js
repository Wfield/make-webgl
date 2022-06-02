import { create, perspective, rotate, translate, invert } from '../../lib/math.js'
import { getRotateDegree, getCameraZ } from './tools.js';

export const draw = (gl, programInfo, buffers) => {
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // 将画布设为白色
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  const modelMat = create();
  // translate(modelMat, modelMat, [-0.5, -0.5, 0]);

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  // 这个矩阵是代表相机在世界坐标中的位置和姿态
  const caremaMat = create();
  // translate(caremaMat, caremaMat, [0.5, 0.5, 0]);
  rotate(caremaMat, caremaMat, getRotateDegree(), [0, 1, 0]);
  translate(caremaMat, caremaMat, [0, 0, getCameraZ()]);
  const viewMat = create();
  invert(viewMat, caremaMat);


  // 设置如何从当前 buffer 中取出数据作为 vertex 顶点的数据
  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  // 启用顶点
  gl.enableVertexAttribArray(pos);

  const { color } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  // 启用顶点
  gl.enableVertexAttribArray(color);

  gl.useProgram(programInfo.program);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);

  translate(modelMat, modelMat, [2.0, -0.5, 0]);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
} 