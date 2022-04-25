import { create, perspective, rotate, translate } from "../../lib/math.js"
import { getXRotateDegree, getYRotateDegree, getZRotateDegree } from './tool.js'

export const draw = (gl, programInfo, buffers) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST) // 深度测试，判断像素的前后
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const modelViewMat = create();
  translate(modelViewMat, modelViewMat, [0.0, 0.0, -2.0]);
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

  gl.useProgram(programInfo.program);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.LINES, buffers.elementNum, gl.UNSIGNED_SHORT, 0)
  // gl.drawArrays(gl.LINE_STRIP, 0, buffers.elementNum)
}