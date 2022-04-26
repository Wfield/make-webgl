import { initShader } from '../../lib/shader.js';

const vertexShader = `
attribute vec4 pos;
attribute vec4 color;

uniform mat4 modelViewMat;
uniform mat4 projectionMat;

varying vec4 vColor;

void main() {
  gl_Position = projectionMat * modelViewMat * pos;
  vColor = color;
}
`

const fragmentShader  =`
varying highp vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`

export const initProgram = (gl) => {
  const program = initShader(gl, vertexShader, fragmentShader);
  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      color: gl.getAttribLocation(program, 'color'),
    },
    uniformLocations: {
      modelViewMat: gl.getUniformLocation(program, 'modelViewMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
    }
  }
}