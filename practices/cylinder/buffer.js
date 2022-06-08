// 圆柱体 vertex

export const initBuffer = (gl) => {
  const radius = .01;
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

  // 上方圆采样
  ang = 0;
  positions.push(0.0, 1.0, 0.0);
  let cnt2 = cnt;
  while (cnt2) {
    const x = radius * Math.cos(ang);
    const z = radius * Math.sin(ang);
    positions.push(x, 1.0, z);
    ang += per_ang;
    cnt2--;
  }


  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indices = [];
  const point_num = positions.length / 3;
  const half_len = point_num / 2;
  // 构成下方圆的三角形
  for (let i = 1; i < half_len; i++) {
    const first = i;
    const second = (i + 1) >= half_len ? 1 : i + 1;
    const third = 0;
    indices.push(first, second, third);
  }

  // 构成上方圆的三角形
  for (let i = half_len + 1; i < point_num; i++) {
    const first = i;
    const second = (i + 1) >= point_num ? half_len + 1 : i + 1;
    const third = half_len;
    indices.push(first, second, third);
  }


  // 圆柱体侧面
  for (let i = 1; i < half_len; i++) {
    const bottom_first = i;
    const bottom_second = (i + 1) >= half_len ? 1 : i + 1;

    const j = half_len + i;
    const top_first = j;
    const top_second = (j + 1) >= point_num ? half_len + 1 : j + 1;

    indices.push(bottom_first, bottom_second, top_first);
    indices.push(top_first, top_second, bottom_second);
  }
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const y_colors = [];
  for(let i = 0; i < point_num; i++) {
    y_colors.push(1.0, 0.0, 0.0, 1.0);
  }
  const y_colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, y_colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(y_colors), gl.STATIC_DRAW);

  const x_colors = [];
  for(let i = 0; i < point_num; i++) {
    x_colors.push(0.0, 1.0, 0.0, 1.0);
  }
  const x_colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, x_colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(x_colors), gl.STATIC_DRAW);

  const z_colors = [];
  for(let i = 0; i < point_num; i++) {
    z_colors.push(0.0, 0.0, 1.0, 1.0);
  }
  const z_colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, z_colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(z_colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    elementNum: indices.length,
    y_color: y_colorBuffer,
    x_color: x_colorBuffer,
    z_color: z_colorBuffer,
  }
}