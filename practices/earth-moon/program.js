import { initShader } from '../../lib/shader.js';

const vertexShader = `
attribute vec4 pos;
attribute vec2 texCoord;

uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;

varying highp vec2 vTexCoord;

void main() {
  gl_Position = projectionMat * viewMat * modelMat * pos;
  vTexCoord= texCoord;
}
`

const fragmentShader = `
uniform sampler2D sampler;
varying highp vec2 vTexCoord;

void main() {
  gl_FragColor = texture2D(sampler, vTexCoord);
}
`

export const initProgram = (gl) => {
  const program = initShader(gl, vertexShader, fragmentShader);

  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      texCoord: gl.getAttribLocation(program, 'texCoord')
    },
    uniformLocations: {
      sampler: gl.getUniformLocation(program, 'sampler'),
      modelMat: gl.getUniformLocation(program, 'modelMat'),
      viewMat: gl.getUniformLocation(program, 'viewMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
    }
  }
}