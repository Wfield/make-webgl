import { initShader } from '../../lib/shader.js';

const vertexShader = `
precision highp float;
attribute vec4 pos;
attribute vec4 color;
attribute vec3 vertexNormal;

uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 normalMat;

varying vec4 vColor;
varying vec3 vLighting;

void main() {
  vec4 transformedNormal = normalMat * vec4(vertexNormal, 1.0);
  vColor = color;

  vec3 lightColor = vec3(1.0, 1.0, 0.0);

  float diffuseStrength = 0.5;
  float diffuseFactor = max(dot(transformedNormal.xyz, diffuseDir), 0.0);
  vec3 diffuseColor = lightColor;
  vec3 diffuse = diffuseColor * diffuseFactor * diffuseStrength;

  float ambientStrength = 0.1;
  vec3 ambientColor = lightColor;
  vec3 ambient = ambientColor * ambientStrength;
  vLighting = ambient + diffuse;

  gl_Position = projectionMat * viewMat *  modelMat * pos;
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
  const program = initShader(gl, vertexShader, fragmentShader);

  return {
    program,
    attribLocations: {
      pos: gl.getAttribLocation(program, 'pos'),
      color: gl.getAttribLocation(program, 'color'),
      vertexNormal: gl.getAttribLocation(program, 'vertexNormal'),
    },
    uniformLocations: {
      modelMat: gl.getUniformLocation(program, 'modelMat'),
      viewMat: gl.getUniformLocation(program, 'viewMat'),
      projectionMat: gl.getUniformLocation(program, 'projectionMat'),
      normalMat: gl.getUniformLocation(program, 'normalMat'),
      // lightColor: gl.getUniformLocation(program, 'lightColor'),
    }
  }
}