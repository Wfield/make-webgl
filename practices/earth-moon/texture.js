const isPowerOf2 = value => (value & (value - 1)) === 0;


export const initTexture = (gl, images = []) => {
  // 创建两个纹理
  var textures = [];
  for (var ii = 0; ii < images.length; ++ii) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // if (isPowerOf2(images[ii].width) && isPowerOf2(images[ii].height)) {
    //   console.log('ssss: ', images[ii].width)
    //   gl.generateMipmap(gl.TEXTURE_2D); // 生成多级渐进纹理
    // } else {
      // 设置参数以便使用任意尺的影像
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // }
    // 上传图像到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);

    console.log('texture: ', texture)
    // 将纹理添加到纹理序列
    textures.push(texture);
  }
  return textures;
}



function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

export function loadImages(urls, callback) {
  console.log('urls: ', urls)
  var images = [];
  var imagesToLoad = urls.length;

  // 每个图像加载完成后调用一次
  var onImageLoad = function () {
    --imagesToLoad;
    // 如果所有图像都加载完成就调用回调函数
    if (imagesToLoad == 0) {
      console.log('images: ', images);
      callback(images);
    }
  };

  for (var ii = 0; ii < imagesToLoad; ++ii) {
    var image = loadImage(urls[ii], onImageLoad);
    images.push(image);
  }
}

