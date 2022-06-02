// Inline from gl-matrix
// https://github.com/toji/gl-matrix

const ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array
const EPSILON = 0.000001

/**
 * return：三维空间的单位向量
 */
export function create () {
  let out = new ARRAY_TYPE(16)
  if (ARRAY_TYPE !== Float32Array) {
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
  }
  out[0] = 1
  out[5] = 1
  out[10] = 1
  out[15] = 1
  return out
}

export function perspective (out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2)
  let nf
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[15] = 0
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far)
    out[10] = (far + near) * nf
    out[14] = (2 * far * near) * nf
  } else {
    out[10] = -1
    out[14] = -2 * near
  }
  return out
}

/**
 * @param {*} out - 变换之后的矩阵
 * @param {*} a - 单位向量的 matrix 表示
 * @param {*} param2 - [dx, dy, dz]
 * @returns 
 */
export function translate (out, a, [x, y, z]) {
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3]
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7]
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11]

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23

    out[12] = a00 * x + a10 * y + a20 * z + a[12]
    out[13] = a01 * x + a11 * y + a21 * z + a[13]
    out[14] = a02 * x + a12 * y + a22 * z + a[14]
    out[15] = a03 * x + a13 * y + a23 * z + a[15]
  }

  return out
}

export function scale(out, a, sx, sy, sz) {
  out[0] = a[0] * sx; out[1] = a[1] * sy; out[2] = a[2] * sz;
  out[4] = a[4] * sx; out[5] = a[5] * sy; out[6] = a[6] * sz;
  out[8] = a[8] * sx; out[9] = a[9] * sy; out[10] = a[10] * sz;
  
  if(a !== out) {
    out[3] = a[3]

    out[7] = a[7]

    out[11] = a[11]

    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  }
  return out;
}


export function rotate (out, a, rad, [x, y, z]) {
  let len = Math.sqrt(x * x + y * y + z * z)
  let s, c, t
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23
  let b00, b01, b02
  let b10, b11, b12
  let b20, b21, b22

  if (len < EPSILON) { return null }

  len = 1 / len
  x *= len
  y *= len
  z *= len

  s = Math.sin(rad)
  c = Math.cos(rad)
  t = 1 - c

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3]
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7]
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11]

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02
  out[1] = a01 * b00 + a11 * b01 + a21 * b02
  out[2] = a02 * b00 + a12 * b01 + a22 * b02
  out[3] = a03 * b00 + a13 * b01 + a23 * b02
  out[4] = a00 * b10 + a10 * b11 + a20 * b12
  out[5] = a01 * b10 + a11 * b11 + a21 * b12
  out[6] = a02 * b10 + a12 * b11 + a22 * b12
  out[7] = a03 * b10 + a13 * b11 + a23 * b12
  out[8] = a00 * b20 + a10 * b21 + a20 * b22
  out[9] = a01 * b20 + a11 * b21 + a21 * b22
  out[10] = a02 * b20 + a12 * b21 + a22 * b22
  out[11] = a03 * b20 + a13 * b21 + a23 * b22

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  }
  return out
}

export function rotateX (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[0]
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c)
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c)

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}


/**
 * 绕 Y 轴旋转
 * @param {*} out 
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 角度
 * @returns 
 */
export function rotateY (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c)
  r[1] = p[1]
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c)

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}

export function rotateZ (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c)
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c)
  r[2] = p[2]

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}

// 矩阵的转置 （T）
export function transpose (out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1]
    let a02 = a[2]
    let a03 = a[3]
    let a12 = a[6]
    let a13 = a[7]
    let a23 = a[11]

    out[1] = a[4]
    out[2] = a[8]
    out[3] = a[12]
    out[4] = a01
    out[6] = a[9]
    out[7] = a[13]
    out[8] = a02
    out[9] = a12
    out[11] = a[14]
    out[12] = a03
    out[13] = a13
    out[14] = a23
  } else {
    out[0] = a[0]
    out[1] = a[4]
    out[2] = a[8]
    out[3] = a[12]
    out[4] = a[1]
    out[5] = a[5]
    out[6] = a[9]
    out[7] = a[13]
    out[8] = a[2]
    out[9] = a[6]
    out[10] = a[10]
    out[11] = a[14]
    out[12] = a[3]
    out[13] = a[7]
    out[14] = a[11]
    out[15] = a[15]
  }

  return out
}

// 矩阵的 逆 （-1）
export function invert (out, a) {
  let a00 = a[0]
  let a01 = a[1]
  let a02 = a[2]
  let a03 = a[3]
  let a10 = a[4]
  let a11 = a[5]
  let a12 = a[6]
  let a13 = a[7]
  let a20 = a[8]
  let a21 = a[9]
  let a22 = a[10]
  let a23 = a[11]
  let a30 = a[12]
  let a31 = a[13]
  let a32 = a[14]
  let a33 = a[15]

  let b00 = a00 * a11 - a01 * a10
  let b01 = a00 * a12 - a02 * a10
  let b02 = a00 * a13 - a03 * a10
  let b03 = a01 * a12 - a02 * a11
  let b04 = a01 * a13 - a03 * a11
  let b05 = a02 * a13 - a03 * a12
  let b06 = a20 * a31 - a21 * a30
  let b07 = a20 * a32 - a22 * a30
  let b08 = a20 * a33 - a23 * a30
  let b09 = a21 * a32 - a22 * a31
  let b10 = a21 * a33 - a23 * a31
  let b11 = a22 * a33 - a23 * a32

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

  if (!det) {
    return null
  }
  det = 1.0 / det

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det

  return out
}


// point • matrix
export function multiplyMatrixAndPoint(matrix, point) {
  // Give a simple constiable name to each part of the matrix, a column and row number
  let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
  let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
  let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
  let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

  // Now set some simple names for the point
  let x = point[0];
  let y = point[1];
  let z = point[2];
  let w = point[3];

  // Multiply the point against each part of the 1st column, then add together
  let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

  // Multiply the point against each part of the 2nd column, then add together
  let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

  // Multiply the point against each part of the 3rd column, then add together
  let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

  // Multiply the point against each part of the 4th column, then add together
  let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

  return [resultX, resultY, resultZ, resultW];
}

export function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function normalize(v) {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

export function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}


export const m4 = {

  lookAt: function(cameraPosition, target, up) {
    const zAxis = normalize(
        subtractVectors(cameraPosition, target));
    const xAxis = normalize(cross(up, zAxis));
    const yAxis = normalize(cross(zAxis, xAxis));

    return [
       xAxis[0], xAxis[1], xAxis[2], 0,
       yAxis[0], yAxis[1], yAxis[2], 0,
       zAxis[0], zAxis[1], zAxis[2], 0,
       cameraPosition[0],
       cameraPosition[1],
       cameraPosition[2],
       1,
    ];
  },

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    const a00 = a[0 * 4 + 0];
    const a01 = a[0 * 4 + 1];
    const a02 = a[0 * 4 + 2];
    const a03 = a[0 * 4 + 3];
    const a10 = a[1 * 4 + 0];
    const a11 = a[1 * 4 + 1];
    const a12 = a[1 * 4 + 2];
    const a13 = a[1 * 4 + 3];
    const a20 = a[2 * 4 + 0];
    const a21 = a[2 * 4 + 1];
    const a22 = a[2 * 4 + 2];
    const a23 = a[2 * 4 + 3];
    const a30 = a[3 * 4 + 0];
    const a31 = a[3 * 4 + 1];
    const a32 = a[3 * 4 + 2];
    const a33 = a[3 * 4 + 3];
    const b00 = b[0 * 4 + 0];
    const b01 = b[0 * 4 + 1];
    const b02 = b[0 * 4 + 2];
    const b03 = b[0 * 4 + 3];
    const b10 = b[1 * 4 + 0];
    const b11 = b[1 * 4 + 1];
    const b12 = b[1 * 4 + 2];
    const b13 = b[1 * 4 + 3];
    const b20 = b[2 * 4 + 0];
    const b21 = b[2 * 4 + 1];
    const b22 = b[2 * 4 + 2];
    const b23 = b[2 * 4 + 3];
    const b30 = b[3 * 4 + 0];
    const b31 = b[3 * 4 + 1];
    const b32 = b[3 * 4 + 2];
    const b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function(m) {
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp_0  = m22 * m33;
    const tmp_1  = m32 * m23;
    const tmp_2  = m12 * m33;
    const tmp_3  = m32 * m13;
    const tmp_4  = m12 * m23;
    const tmp_5  = m22 * m13;
    const tmp_6  = m02 * m33;
    const tmp_7  = m32 * m03;
    const tmp_8  = m02 * m23;
    const tmp_9  = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  vectorMultiply: function(v, m) {
    const dst = [];
    for (const i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (const j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
    return dst;
  },

};