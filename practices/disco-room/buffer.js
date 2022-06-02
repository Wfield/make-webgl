

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

  // 使用三角形, 一个面需要两个三角形
  const indices = [
    0, 1, 3, 0, 2, 3, // front face
    1, 5, 7, 1, 3, 7, // right face
    0, 2, 6, 0, 4, 6, // left face
    2, 3, 7, 2, 6, 7, // top face
    0, 1, 5, 0, 4, 5, // bottom face
    4, 5, 7, 4, 6, 7, // back face
  ]

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


  const pointColors = [
    [0.0, 0.0, 0.0, 1.0], // black
    [1.0, 0.0, 0.0, 1.0], // Red
    [0.0, 1.0, 0.0, 1.0], // Green
    [0.0, 0.0, 1.0, 1.0], // Blue
    [1.0, 1.0, 0.0, 1.0], // Yellow
    [1.0, 0.0, 1.0, 1.0], // Purple
    [0.0, 1.0, 1.0, 1.0], // 
    [0.5, 0.5, 0.5, 1.0], // 
  ]
  const colors = [];
  for(let i = 0; i < indices.length; i++) {
    const pointIndex = indices[i];
    const c = pointColors[pointIndex];
    colors.push(...c)
  }
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return {
    positionBuffer: cubeBuffer,
    indexBuffer: indexBuffer,
    elementNum: indices.length,
    colorBuffer,
  }
}