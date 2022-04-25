import { create, translate, perspective, rotate } from '../../lib/math.js';

export const draw = (gl, programInfo, buffers) => {
  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(pos);

  const modelViewMat = create();
  translate(modelViewMat, modelViewMat, [0.0, 0.0, -2.0]);
  // const delta = Math.PI / 4;
  // rotate(modelViewMat, modelViewMat, delta, [0, 1, 0])

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0)

  gl.useProgram(programInfo.program);
  // uniform 的赋值必须要在 useProgram 之下. 为什么?
  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat)
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat)

  // gl.drawArrays(gl.LINE_LOOP, 0, 3 * 10)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3 * 10)
}