import { create, perspective, translate, rotate } from '../../lib/math.js';

export const draw = (gl, programInfo, buffers) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST) // 深度测试，判断像素的前后

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fov = Math.PI / 6; // 视角
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight

  const projectionMat = create();
  perspective(projectionMat, fov, aspect, 0.1, 100.0)

  const modelViewMat = create();
    /**
    * 此时的 modelViewMat：
    * 1, 0, 0, 0,
    * 0, 1, 0, 0,
    * 0, 0, 1, 0,
    * 0, 0, 0, 1,
    */
  translate(modelViewMat, modelViewMat, [-0.0, 0.0, -20.0])
      /**
    * 此时的 modelViewMat：
    * 1, 0, 0, 0,
    * 0, 1, 0, 0,
    * 0, 0, 1, 0,
    * 0, 0, -20, 1,
    */

  const delta = Math.PI / 4
  rotate(modelViewMat, modelViewMat, delta, [1, 1, 0])

  const { pos } = programInfo.attribLocations
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(pos)

  const { color } = programInfo.attribLocations
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0) // 颜色是 4 个维度的数据
  gl.enableVertexAttribArray(color)

  gl.useProgram(programInfo.program)

  // 关联到 gpu 全局变量
  const { uniformLocations } = programInfo;
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat); // 这个 api 的使用
  gl.uniformMatrix4fv(uniformLocations.modelViewMat, false, modelViewMat);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}