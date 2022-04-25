import { create, rotate, multiplyMatrixAndPoint } from "../../lib/math.js";
import { getLongitudeNum, getLongitudePointNum } from './tool.js'

// longitude 经度
// latitude 纬度
// 半圆弧旋转 360 度
const radius = 1.0;
// const lon_num = getLongitudeNum(); // 将经度线分为多少份
// const lat_num = getLongitudePointNum(); // 将圆周分为多少份
const lon_num = 36;
const lat_num = 36;
const per_angle_log = Math.PI / (lon_num - 1); // 两端的点都需要绘制,所以角度是 lon_num - 1 个;
const per_angle_lat = 2 * Math.PI / lat_num; // 纬度每份角度

export const initBuffers = (gl) => {
  const points = []; // 经度线上半圆上的点
  let angle = -1 * Math.PI / 2;
  for (let i = 0; i < lon_num; i++) { 
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y, -0.0]);
    angle += per_angle_log;
  }

  const positions = []; // 第一个点是(0, 0, -1) 按逆时针方向的点,依次 push

  const rotateMat = create();
  let angle2 = 0;
  for (let i = 0; i < lat_num; i++) { 
    rotate(rotateMat, rotateMat, angle2, [0, 1, 0]) // 从 0 度开始, 绕 y 轴逆时针旋转 360 度, 即 lat_num 次
    points.forEach(pos => {
        const [prev_x, prev_y, prev_z] = pos;
        const x = prev_x * Math.cos(angle2)
        const z = -prev_x * Math.sin(angle2);
        positions.push(x, prev_y, z)
    });
    angle2 += per_angle_lat;
  }

  // console.log('positions: ', positions)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indices = []; // 空间中的点的位置与点(x,y,z)在 position 数组中的顺序关系

  for(let n = 0; n < lat_num * lon_num - 1; n++) {
    indices.push(n, n + 1);
  }

  for(let n = 0; n < lat_num; n++) {
    for(let m = 1; m < lon_num; m++) { //对于经线上的每个点, 链接到下个经线上对于的点
      const start = m + (n * lon_num);
      const nextStart = (start + lon_num) % (lat_num * lon_num);
      indices.push(start, nextStart);
    }
  }


  // console.log('indices: ', indices)
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    positions: positionBuffer,
    indices: indexBuffer,
    // elementNum: lon_num * lat_num,
    elementNum: indices.length,
  }
}