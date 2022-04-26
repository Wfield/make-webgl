const isPowerOf2 = value => (value & (value - 1)) === 0;

export const initTexture = (gl, url) => new Promise((resolve) => {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);  // 当前使用的纹理

  const image = new Image();
  image.onload = () => {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // 把已经加载的图片图形数据写到纹理

    if(isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D); // 生成多级渐进纹理
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    resolve(texture)
  }

  image.src = url;
})