import { initProgram } from './program.js';
import { initBuffers } from './buffer.js';
import { draw } from './draw.js';
import { createTool } from '../../lib/utils.js';

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const buffers = initBuffers(gl);

const values = {};

const drawFrame = () => {
  draw(gl, programInfo, buffers, values);
}

drawFrame();

createTool({ type: 'range', name: 'cam-rotate-y', min: 0, max: 360, onChange: drawFrame }, values)
createTool({ type: 'range', name: 'cam-rotate-x', min: 0, max: 360, onChange: drawFrame }, values)
createTool({ type: 'range', name: 'cam-trans-z', min: -2, max: 100, defaultValue: 0, onChange: drawFrame }, values)