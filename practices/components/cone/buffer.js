
// 圆锥
export const initBuffers = (gl) => {
  const radius = .04;
  const cnt = 360 / 10; // 采样次数, 每 10deg 采样一次; 
  const per_ang = 2 * Math.PI / cnt; // 没错采样角度;
  let ang = 0;

  // 下方圆采样
  const positions = [0.0, 0.0, 0.0];
  let cnt1 = cnt;
  while (cnt1) {
    const x = radius * Math.cos(ang);
    const z = radius * Math.sin(ang);
    positions.push(x, 0, z);
    ang += per_ang;
    cnt1--;
  }

  positions.push(0.0, 0.1, 0.0);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER , new Float32Array(positions), gl.STATIC_DRAW);


  const indices = [];
  const point_num = positions.length / 3;
  for (let i = 1; i < point_num - 1; i++) {
    const first = i;
    const second = (i + 1) >= point_num - 1 ? 1 : i + 1;
    const third = 0;
    const top = point_num - 1;
    indices.push(first, second, third);
    indices.push(first, second, top);
  }

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  

  return {
    position: positionBuffer,
    indices: indexBuffer,
    elementNum: indices.length
  }
}