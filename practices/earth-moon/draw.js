import { create, perspective, translate, rotate, scale } from '../../lib/math.js';
import { getCameraRotateDegree } from './tools.js';

// const changePositions = [
//   [0.0, 0.0, 0.0],
//   [2.0, 5.0, -15.0],
//   [1.5, 2.2, -2.5],
//   [3.8, 2.0, -12.3],
//   [2.4, -0.4, -3.5],
//   [-1.7, 3.0, -7.5],
//   [1.3, -2.0, -2.5],
//   [1.5, 2.0, -2.5],
//   [1.5, 0.2, -1.5],
//   [-1.3, 1.0, -1.5]
// ]

let delta = 0;
const getDelta = () => { delta += 2; return delta / 60; }

export const draw = (gl, programInfo, buffers, textures) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DETPTH_BUFFER_BIT);

  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const viewMat = create();
  const cameraR = getCameraRotateDegree();
  translate(viewMat, viewMat, [0.0, -0.0, -15.0]);
  rotate(viewMat, viewMat, cameraR, [0.0, 0.0, 1.0]);

  const moonModelMat = create();

  const earthModelMat = create();
  scale(earthModelMat, moonModelMat, 2.0, 2.0, 2.0) // 地球是月球大小的两倍

  // 将月球位移, 避免和地球重合
  translate(moonModelMat, moonModelMat, [5.0, 0.0, 0.0]);


  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);


  const { texCoord } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoord);


  // console.log('textures[0]: ', textures[0])
  // 将地球的纹理绑定在第一个纹理单元
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);

  // 将月球的纹理绑定在第二个纹理单元
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[1]);


  gl.useProgram(programInfo.program);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // let angle = 0
  // for (let i = 0; i < changePositions.length; i++) {
  //   angle = 20.0 * i;
  //   translate(modelMat, modelMat, changePositions[i]);
  //   rotate(modelMat, modelMat, angle, [1.0, 0.3, 0.5]);
  //   gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);

  //   gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
  // }

  // 绘制地球
  gl.uniform1i(uniformLocations.sampler, 0); // 使用第一个纹理单元
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, earthModelMat);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);

  // 绘制月球
  const angle = getDelta();
  rotate(moonModelMat, moonModelMat, angle, [0.0, 1.0, 0.0]);
  rotate(moonModelMat, moonModelMat, angle, [1, 1, 0]);
  gl.uniform1i(uniformLocations.sampler, 1); // 使用第二个纹理单元
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, moonModelMat);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
}