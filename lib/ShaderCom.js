class ShaderCom {
  constructor(gl, program, buffer) {
    this._gl = gl;
    this._program = program;
    this._buffer = buffer;
  }

  /**
   * 
   * @param {*} key 
   * @param {*} val 
   */
  setUniformMatrixMat(path, mat) {
    const key = this._program[path];
    this._gl.uniformMatrix4fv(key, mat);
  }

  setLocation(path, bufferData) {
    const key = this._program[path];
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bufferData);
    this._gl.vertexAttribPointer(key, 3, gl.FLOAT, false, 0, 0);
  }
}

// 将 shader 分为几种 type, (根据输入的变量来判断), 自动生成 shader template
// 输入 glsl 变量 (pos, color, light), 那么在设置变量值时就比较方便