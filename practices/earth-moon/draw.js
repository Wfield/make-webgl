import { create, perspective, translate, rotate, scale } from '../../lib/math.js';
import { getCameraRotateDegree } from './tools.js';

let delta = 0;
const getDelta = () => { delta += 2; return delta / 60; }

// 地球的转轴倾角(自转轴相对于轨道平面的倾斜角度)
const obliquity = Math.PI * (23.44 / 180);

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
  rotate(viewMat, viewMat, cameraR, [1.0, 0.0, 0.0]);

  const moonModelMat = create();

  const earthModelMat = create();
  scale(earthModelMat, moonModelMat, 2.0, 2.0, 2.0) // 地球是月球大小的两倍

  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);


  const { texCoord } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoord);


  // 将地球的纹理绑定在第一个纹理单元
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);

  // 将月球的纹理绑定在第二个纹理单元
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[1]);


  gl.useProgram(programInfo.program);

  const angle = getDelta();

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // 绘制地球
  rotate(earthModelMat, earthModelMat, -1 * obliquity, [0.0, 0.0, 1.0]);
  rotate(earthModelMat, earthModelMat, angle, [0, 1, 0]) // 地球自转
  gl.uniform1i(uniformLocations.sampler, 0); // 使用第一个纹理单元
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, earthModelMat);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);

  // 绘制月球
  // 将月球位移, 避免和地球重合
  // (注意顺序: 先旋转, 再位移; 因为是在调用 rotate 时在 world space 中确定了旋转的轴) 
  rotate(moonModelMat, moonModelMat, angle / 28, [0, 1, 0]); // 地球转 28 次, 月球绕地球转一圈
  translate(moonModelMat, moonModelMat, [5.0, 0.0, 0.0]);
  rotate(moonModelMat, moonModelMat, angle / 28, [0, 1, 0]); // 月球自转, 自转和公转速度相同
  gl.uniform1i(uniformLocations.sampler, 1); // 使用第二个纹理单元
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, moonModelMat);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
}