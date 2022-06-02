import { initProgram } from './program.js';
import { initBuffers } from './buffer.js';
import { draw } from './draw.js';

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const buffers = initBuffers(gl);

const drawFrame = () => {
  draw(gl, programInfo, buffers);
  window.requestAnimationFrame(drawFrame);
}

drawFrame();