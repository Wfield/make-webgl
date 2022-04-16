import { initShader } from '../../lib/shader.js';

const vertexShander = `
precision highp float;
attribute vec4 pos;
attribute vec4 color;
attribute vec3 vertexNormal;

uniform mat4 normalMat;
uniform mat4 modelViewMat;
uniform mat4 projectionMat;

varying vec4 vColor;
varying vec3 vLighting;

void main() {
  vec4 transformedNormal = normalMat * vec4(vertexNormal, 1.0);

  float ambientStrength = 1.0;
  vec3 ambientColor = vec3(0.3, 0.3, 0.3);
  vec3 ambient = ambientColor * ambientStrength;

  float diffuseStrength = 0.8;
  vec3 diffuseColor = vec3(1, 1, 1);
  vec3 diffuseDir = normalize(vec3(1, 0, 0.75));
  float diffuseFactor = max(dot(transformedNormal.xyz, diffuseDir), 0.0);
  vec3 diffuse = diffuseColor * diffuseFactor * diffuseStrength;

  vColor = color;
  vLighting = ambient + diffuse;

  gl_Position = projectionMat * modelViewMat * pos;
}
`

const fragmentShader = `
precision highp float;
varying vec4 vColor;
varying vec3 vLighting;
void main() {
  gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
}
`

export const initProgram = (gl) => {
  const program = initShader(gl, vertexShander, fragmentShader);

  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      color: gl.getAttribLocation(program, 'color'),
      vertexNormal: gl.getAttribLocation(program, 'vertexNormal'),
    },
    uniformLocations: {
      normalMat: gl.getUniformLocation(program, 'normalMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
      modelViewMat: gl.getUniformLocation(program, 'modelViewMat'),
    }
  }
}