
// 四棱锥
export const initBuffers = (gl) => {
  const positions = [
    1.0, 0.0, 0.0,
    0.0, 0.0, -1.0,
    -1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
  ];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indices = [
    0, 1,
    1, 2,
    2, 3,
    3, 0,
    0, 4,
    1, 4,
    2, 4,
    3, 4,
  ];
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    elementNum: indices.length,
  }
}