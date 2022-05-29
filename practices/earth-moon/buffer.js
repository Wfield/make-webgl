// longitude 经度
// latitude 纬度
// 思路: 先画一个半圆弧, 然后将半圆弧旋转 360 度
const radius = 1.0;
const lon_num = 36; // 将经度线分为多少份
const lat_num = 180; // 将圆周分为多少份
const per_angle_log = Math.PI / (lon_num - 1); // 两端的点都需要绘制,所以角度是 lon_num - 1 个;
const per_angle_lat = 2 * Math.PI / (lat_num - 1); // 纬度上每份圆弧的角度 (这里 - 1,是因为在贴纹理时,发现贴图头尾有一条缝隙. 这里多画了一条经线,最后一条经线与第一条经线重合)

export const initBuffers = (gl) => {
  const points = []; // 经度线上半圆上的点
  let angle = -1 * Math.PI / 2;
  for (let i = 0; i < lon_num; i++) {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y, -0.0]);
    angle += per_angle_log;
  }

  const positions = []; // 第一个点是(0, -1, 0) 按逆时针方向的点,依次 push

  let angle2 = 0;
  for (let i = 0; i < lat_num; i++) {
    // 从 0 度开始, 绕 y 轴逆时针旋转 360 度, 即 lat_num 次
    points.forEach(pos => {
      const [prev_x, prev_y] = pos;
      const x = prev_x * Math.cos(angle2)
      const z = -prev_x * Math.sin(angle2);
      positions.push(x, prev_y, z)
    });
    angle2 += per_angle_lat;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indices = []; // 空间中的点的位置与点(x,y,z)在 position 数组中的顺序关系
  for (let n = 0; n < lat_num; n++) {
    for (let m = 0; m < lon_num - 1; m++) { //对于经线上的每个点, 链接到下个经线上对于的点
      const point = m + (n * lon_num);
      if (m === 0 || m === lon_num - 2) {
        const nextLatPoint = (point + lon_num + 1) % (lat_num * lon_num);
        indices.push(point, point + 1, nextLatPoint);
      } else {
        const nextLatPoint = (point + lon_num) % (lat_num * lon_num);
        indices.push(point, point + 1, nextLatPoint);
        indices.push(point + 1, nextLatPoint, nextLatPoint + 1);
      }
    }
  }

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const texCoord = []; // u v 坐标, 顺序与 position 中的点(空间中的点)一一对应. 坐标原点是图片左下角
  let u_val = 0;
  const per_u_piece = 360 / lat_num;
  let v_val = 0;
  const per_v_piece = 180 / lon_num;
  for (let w = 0; w < lat_num; w++) {
    for (let h = 0; h < lon_num; h++) {
      const width = u_val / 360;
      const height = v_val / 180;
      texCoord.push(width, height);
      v_val += per_v_piece;
    }
    v_val = 0;
    u_val += per_u_piece;
  }
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);

  return {
    positions: positionBuffer,
    indices: indexBuffer,
    elementNum: indices.length,
    texCoord: texCoordBuffer,
  }
}