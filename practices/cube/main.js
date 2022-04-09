import { initBuffers } from "./buffers.js";
import { draw } from "./draw.js";
import { initProgramInfo } from "./program.js"


const gl = document.querySelector('#gl-canvas').getContext('webgl')

const programInfo = initProgramInfo(gl);
const buffers = initBuffers(gl);
draw(gl, programInfo, buffers)