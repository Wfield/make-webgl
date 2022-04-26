import { create, perspective, rotate, translate } from "../../lib/math.js"
import { getXRotateDegree, getYRotateDegree, getZRotateDegree, getNear } from './tool.js'

export const draw = (gl, programInfo, buffers, texture) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST) // 深度测试，判断像素的前后
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const modelViewMat = create();
  const near = getNear();
  translate(modelViewMat, modelViewMat, [0.0, 0.0, 0 - near]);
  const xDeg = getXRotateDegree();
  rotate(modelViewMat, modelViewMat, xDeg, [1.0, 0.0, 0.0])
  const yDeg = getYRotateDegree();
  rotate(modelViewMat, modelViewMat, yDeg, [0.0, 1.0, 0.0])
  const zDeg = getZRotateDegree();
  rotate(modelViewMat, modelViewMat, zDeg, [0.0, 0.0, 1.0])

  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  const { texCoord } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoord);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.useProgram(programInfo.program);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  // 1维有符号整数
  gl.uniform1i(uniformLocations.sampler, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0)
}