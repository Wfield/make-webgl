import { create, m4 } from '../../lib/math.js';
import { degToRad } from '../../lib/utils.js';

const drawElementPosition = (gl, programInfo, buffer, modelMat) => {
  const { pos } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
  gl.drawElements(gl.TRIANGLES, buffer.elementNum, gl.UNSIGNED_SHORT, 0);
}

const drwaElementColor = (gl, programInfo, buffer) => {
  const { color } = programInfo.attribLocations;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);
}

export const draw = (gl, programInfo, { coneBuffer, cylinderBuffer }, projectionMat, viewMat) => {
  gl.useProgram(programInfo.program);
  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  // 渲染圆柱体
  let cylinderModelMat = create();
  drwaElementColor(gl, programInfo, cylinderBuffer.y_color);
  drawElementPosition(gl, programInfo, cylinderBuffer, cylinderModelMat);
  // 渲染圆锥体(相对于 圆柱体 进行位移)
  drawElementPosition(gl, programInfo, coneBuffer, m4.translate(cylinderModelMat, 0, 0.9, 0));

  // 绘制 x 轴
  drwaElementColor(gl, programInfo, cylinderBuffer.x_color);
  cylinderModelMat = m4.zRotate(cylinderModelMat, degToRad(-90));
  drawElementPosition(gl, programInfo, cylinderBuffer, cylinderModelMat);
  drawElementPosition(gl, programInfo, coneBuffer, m4.translate(cylinderModelMat, 0, 0.9, 0));

  // 绘制 z 轴
  drwaElementColor(gl, programInfo, cylinderBuffer.z_color);
  cylinderModelMat = m4.xRotate(cylinderModelMat, degToRad(90));
  drawElementPosition(gl, programInfo, cylinderBuffer, cylinderModelMat);
  drawElementPosition(gl, programInfo, coneBuffer, m4.translate(cylinderModelMat, 0, 0.9, 0));
}

