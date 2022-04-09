const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader)

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('Error compiling shaders ', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader;
}



export const initShader = (gl, vsShader, fsShader) => {
  const vertexShander = compileShader(gl, gl.VERTEX_SHADER, vsShader);
  const fragmentShander = compileShader(gl, gl.FRAGMENT_SHADER, fsShader);
  
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShander)
  gl.attachShader(shaderProgram, fragmentShander)
  gl.linkProgram(shaderProgram)

  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Error init shader program ', gl.getProgramInfoLog(shaderProgram))
    return null
  }
  return shaderProgram
}