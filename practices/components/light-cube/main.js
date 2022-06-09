import { initProgram } from './program.js';
import { initBuffers } from '../cube/face-buffer.js';
import { draw } from './draw.js';
import { create, perspective, invert } from '../../../lib/math.js';

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const buffers = initBuffers(gl);

const projectionMat = create();
const fov = Math.PI / 3;
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
perspective(projectionMat, fov, aspect, 0.1, 100.0);

const caremaMat = create();
const viewMat = create();
invert(viewMat, caremaMat);

// draw(gl, programInfo, buffers, projectionMat, caremaMat);

export const drawFrame = (_gl, _projectionMat, _caremaMat) => {
  draw(_gl, programInfo, buffers, _projectionMat, _caremaMat)
}