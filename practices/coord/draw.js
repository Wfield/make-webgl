import { create, invert, perspective, m4 } from '../../lib/math.js';
import { degToRad } from '../../lib/utils.js';

export const draw = (gl, programInfo, { coneBuffer, cylinderBuffer }, values) => {
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // 将画布设为白色
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  const { pos, color } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  let cameraMat = create();
  cameraMat = m4.yRotate(cameraMat, degToRad(values['cam-rotate-y']));
  cameraMat = m4.translate(cameraMat, 0, 0, 2);
  const viewMat = create();
  invert(viewMat, cameraMat);

  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  // 渲染圆锥体
  let coneModelMat = create();
  coneModelMat = m4.translate(coneModelMat, 0, 0, -1);
  gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, coneModelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneBuffer.indices);
  gl.drawElements(gl.TRIANGLES, coneBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // 渲染圆柱体
  let cylinderModelMat = create();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.y_color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  cylinderModelMat = m4.zRotate(cylinderModelMat, degToRad(-90));
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.x_color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  cylinderModelMat = m4.xRotate(cylinderModelMat, degToRad(90));
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.z_color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

}