// 正方体 - 线
export const initBuffers = (gl) => {
  const cube = [
    0.0, 0.0, 0.0, // front left bottom
    1.0, 0.0, 0.0, // front r bottom
    0.0, 1.0, 0.0,// front l top
    1.0, 1.0, 0.0,// front r top
    0.0, 0.0, -1.0, // back l b
    1.0, 0.0, -1.0, // b r b
    0.0, 1.0, -1.0, // b l t
    1.0, 1.0, -1.0,// b r t
  ]

  const cubeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW);

  // 画 12 条线
  const indices = [
    0, 1,
    0, 2,
    1, 3,
    2, 3,
    4, 5,
    4, 6,
    5, 7,
    6, 7,
    0, 4,
    1, 5,
    2, 6,
    3, 7,
  ]

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


  const colors = [];
  for(let i = 0; i < indices.length; i++) {
    colors.push(0.0, 0.0, 0.0, 1.0);
  }
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return {
    position: cubeBuffer,
    indices: indexBuffer,
    elementNum: indices.length,
    color: colorBuffer,
  }
}