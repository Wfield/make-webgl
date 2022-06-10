class ShaderCom {
  constructor(gl, program, buffer) {
    this._gl = gl;
    this._program = program;
    this._buffer = buffer;
  }

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