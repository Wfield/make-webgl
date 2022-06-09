import { createTool } from '../../lib/utils.js';
import { initProgram } from './program.js';
import { initBuffers as initCubeBuffer } from '../components/cube/buffer.js';
import { initBuffers as initPyramidBuffer } from '../components/pyramid/buffer.js';
import { draw } from './draw.js';

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const cubeBuffer = initCubeBuffer(gl);
const pyramidBuffer = initPyramidBuffer(gl);

const values = {}

const drawFrame = () => {
  draw(gl, programInfo, { cubeBuffer, pyramidBuffer }, values)
}

drawFrame();

createTool({ type: 'range', name: 'cam-rotate-y', min: 0, max: 360, onChange: drawFrame }, values)


