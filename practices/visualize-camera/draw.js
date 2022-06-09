import { create, perspective, invert, m4 } from '../../lib/math.js'
import { clearCanvasToColor, drawElementPosition, degToRad } from '../../lib/utils.js';

export const draw = (gl, programInfo, { cubeBuffer, pyramidBuffer }, values) => {
  clearCanvasToColor(gl, [1.0, 1.0, 1.0]);

  gl.useProgram(programInfo.program);
  const { pos, color } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;

  const projectionMat = create();
  const fov = Math.PI / 3;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  perspective(projectionMat, fov, aspect, 0.1, 100.0);
  gl.uniformMatrix4fv(uniformLocations.projectionMat, false, projectionMat);


  // 这个矩阵是代表相机在世界坐标中的位置和姿态
  let caremaMat = create();
  caremaMat = m4.yRotate(caremaMat, degToRad(values['cam-rotate-y']));
  caremaMat = m4.translate(caremaMat, -0.0, -0.0, 5.0);
  const viewMat = create();
  invert(viewMat, caremaMat);
  gl.uniformMatrix4fv(uniformLocations.viewMat, false, viewMat);

  // 颜色
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);

  // cube
  let cubeModelMat = create();
  const scaleVal = 0.2;
  cubeModelMat = m4.scale(cubeModelMat, scaleVal, scaleVal, scaleVal); // 最后缩小物体
  cubeModelMat = m4.scale(cubeModelMat, Math.SQRT2, Math.SQRT2, Math.SQRT2);
  cubeModelMat = m4.translate(cubeModelMat, -0.5, -0.5, 0.5);
  drawElementPosition(gl, programInfo, cubeBuffer, cubeModelMat, gl.LINES);

  // pyramid 
  let pyramidModelMat = create();
  pyramidModelMat = m4.scale(pyramidModelMat, scaleVal, scaleVal, scaleVal); // 最后缩小物体
  pyramidModelMat = m4.yRotate(pyramidModelMat, degToRad(45));
  pyramidModelMat = m4.translate(pyramidModelMat, -0.0, 1 + Math.SQRT2 / 2, 0.0);
  pyramidModelMat = m4.xRotate(pyramidModelMat, degToRad(180));
  drawElementPosition(gl, programInfo, pyramidBuffer, pyramidModelMat, gl.LINES);
} 