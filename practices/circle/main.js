import { draw } from "./draw.js";
import { initProgram } from './program.js';
import { initBuffers } from './buffers.js'

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl)
const buffers = initBuffers(gl);

draw(gl, programInfo, buffers);