export const initBuffers = (gl) => {
  let delta = 0 // 0 ~ PI
  const cnt = 10; // 将一个圆分成多少个三角形
  const per_delta = 2 * Math.PI / cnt; // 每个三角形的角度
  const radius = 1.0; // 半径
  
  const positions = [];

  let prev_x = radius;
  let prev_y = 0.0;
  
  for(let i = 0; i < cnt; i++) {
    delta += per_delta;
    const x = radius * Math.cos(delta);
    const y = radius * Math.sin(delta);
    positions.push(prev_x, prev_y, x, y, 0.0, 0.0);
    prev_x = x;
    prev_y = y;
  }
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  
  return {
    position: positionBuffer,
  }
}