import { initShader } from '../../lib/shader.js';

const vertexShader = `
precision highp float;
attribute vec4 pos;
attribute vec4 color;

uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;

uniform mat4 normalMat;

varying vec4 vColor;
varying vec3 vLighting;

void main() {
  gl_Position = projectionMat * viewMat *  modelMat * pos;

  vColor = color;

  float diffuseStrength = ???
  float diffuseFactor = max(dot(transformedNormal.xyz, diffuseDir), 0.0);
  vec3 diffuseColor = ???
  vec3 diffuse = diffuseColor * diffuseFactor * diffuseStrength;

  float ambientStrength = ???
  vec3 ambientColor = ???
  vec3 ambient = ambientColor * ambientStrength;
  vLinghting = ambient + diffuse;
}
`

const fragmentShader = `
varying highp float;
varying vec4 vColor;
varying vec3 vLighting;

void main() {
  gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
}
`



export const initProgram = (gl) => {
  const program = initShader(gl, vertexShader, fragmentShader);

  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      color: gl.getAttribLocation(program, 'color')
    },
    uniformLocations: {
      modelMat: gl.getUniformLocation(program, 'modelMat'),
      viewMat: gl.getUniformLocation(program, 'viewMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
    }
  }
}