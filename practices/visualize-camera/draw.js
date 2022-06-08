import { create, perspective, rotate, translate, invert, m4, scale } from '../../lib/math.js'
import { degToRad } from '../../lib/utils.js';

export const draw = (gl, programInfo, { roomBuffer, coneBuffer, cameraBuffer, cylinderBuffer }, values) => {
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
  perspective(projectionMat, fov, aspect, values.near || 0.1, 100.0);

  // 这个矩阵是代表相机在世界坐标中的位置和姿态
  let caremaMat = create();
  // caremaMat = m4.lookAt(caremaMat, [0.5, 0.5, 0.5], [0, 1, 0]);
  caremaMat = m4.yRotate(caremaMat, degToRad(values['cam-rotate-y']));
  caremaMat = m4.xRotate(caremaMat, degToRad(values['cam-rotate-x']));
  caremaMat = m4.zRotate(caremaMat, degToRad(values['cam-rotate-z']));
  translate(caremaMat, caremaMat, [values['cam-trans-x'], values['cam-trans-y'], values['cam-trans-z']]);
  const viewMat = create();
  invert(viewMat, caremaMat);

  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);


  // 渲染可视化相机
  let cameraModelMat = create();
  const scaleVal = Math.SQRT2;
  scale(cameraModelMat, cameraModelMat, scaleVal, scaleVal, scaleVal);
  translate(cameraModelMat, cameraModelMat, [-0.5, -0.5, 0.5]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cameraBuffer.positionBuffer);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  gl.bindBuffer(gl.ARRAY_BUFFER, cameraBuffer.colorBuffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  gl.uniformMatrix4fv(uniformLocations.modelMat, false, cameraModelMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cameraBuffer.indexBuffer);
  gl.drawElements(gl.LINES, cameraBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // // 渲染 room
  // const roomModelMat = create();

  // gl.bindBuffer(gl.ARRAY_BUFFER, roomBuffer.positionBuffer);
  // gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(pos);

  // gl.bindBuffer(gl.ARRAY_BUFFER, roomBuffer.colorBuffer);
  // gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(color);

  // gl.uniformMatrix4fv(uniformLocations.modelMat, false, roomModelMat);

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, roomBuffer.indexBuffer);
  // gl.drawElements(gl.TRIANGLE_STRIP, roomBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // 渲染椎体
  let coneModelMat = create();
  translate(coneModelMat, coneModelMat, [-0.0, scaleVal / 2 + 1, 0]);
  coneModelMat = m4.xRotate(coneModelMat, degToRad(180));
  coneModelMat = m4.yRotate(coneModelMat, degToRad(45));

  gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  gl.uniformMatrix4fv(uniformLocations.modelMat, false, coneModelMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneBuffer.indices);
  gl.drawElements(gl.LINES, coneBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // 渲染圆柱体
  // let cylinderModelMat = create();
  // gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.position);
  // gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(pos);

  // gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.y_color);
  // gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(color);

  // gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  // gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // cylinderModelMat = m4.zRotate(cylinderModelMat, degToRad(-90));
  // gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.x_color);
  // gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(color);
  // gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  // gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

  // cylinderModelMat = m4.xRotate(cylinderModelMat, degToRad(90));
  // gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer.z_color);
  // gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(color);
  // gl.uniformMatrix4fv(uniformLocations.modelMat, false, cylinderModelMat);
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indices);
  // gl.drawElements(gl.TRIANGLES, cylinderBuffer.elementNum, gl.UNSIGNED_SHORT, 0);

} 