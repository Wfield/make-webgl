import { create, perspective, rotate, translate } from '../../lib/math.js';

export const draw = (gl, programInfo, buffers, texture) => {
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = Math.PI / 6;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0);

  const modelViewMat = create();
  translate(modelViewMat, modelViewMat, [-0.0, 0.0, -8.0]);

  const delta = Math.PI / 4;
  rotate(modelViewMat, modelViewMat, delta, [1, 1, 0]);

  const { pos } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);

  const { texCoord } = programInfo.attribLocations;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoord);

  gl.useProgram(programInfo.program);

  // 用来激活指定的纹理单元, 其值是 gl.TEXTUREI ，其中的 I 在 0 到 gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1 范围内
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);
  // 1维有符号整数
  gl.uniform1i(uniformLocations.sampler, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}