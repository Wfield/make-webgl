import { initShader } from '../../lib/shader.js';

const vertexShader = `
attribute vec4 pos;

uniform mat4 modelViewMat;
uniform mat4 projectionMat;

void main() {
  gl_Position = projectionMat * modelViewMat * pos;
}
`

const fragmentShader  =`
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

export const initProgram = (gl) => {
  const program = initShader(gl, vertexShader, fragmentShader);
  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos')
    },
    uniformLocations: {
      modelViewMat: gl.getUniformLocation(program, 'modelViewMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
    }
  }
}