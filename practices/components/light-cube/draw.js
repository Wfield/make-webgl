import { create, scale, m4 } from "../../../lib/math.js";

export const draw = (gl, programInfo, buffers, projectionMat, viewMat) => {
  gl.useProgram(programInfo.program);
  const { pos, color } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;

  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color); // 颜色的变量不需要 enableVertexAttribArray, 因为这个变量是要传递给 fs 的, 而不是在 vs 中使用

  let modelMat = create();
  modelMat = m4.translate(modelMat, 0, 1.0 - 0.2, 0);
  const scaleVal = 0.2;
  scale(modelMat, modelMat, scaleVal, scaleVal, scaleVal);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.TRIANGLE_STRIP, buffers.elementNum, gl.UNSIGNED_SHORT, 0);
}