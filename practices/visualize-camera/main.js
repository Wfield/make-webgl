import { createTool } from '../../lib/utils.js';
import { initProgram } from './program.js';
import { initBuffers as initCameraBuffer } from './buffer.js';
import { initBuffers as initRoomBuffer } from '../disco-room/buffer.js';
import { draw } from './draw.js';



const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const cameraBuffer = initCameraBuffer(gl);

const roomBuffer = initRoomBuffer(gl);


const values = {}

const drawFram = () => {
  draw(gl, programInfo, {cameraBuffer, roomBuffer}, values)
}

drawFram();

createTool({ type: 'range', name: 'rotate', min: 0, max: 360, onChange: drawFram }, values)
createTool({ type: 'range', name: 'cam-trans-x', min: 0, max: 100, step: 0.5, onChange: drawFram }, values)
createTool({ type: 'range', name: 'cam-trans-y', min: 0, max: 100, step: 0.5, onChange: drawFram }, values)
createTool({ type: 'range', name: 'cam-trans-z', min: 0, max: 100, onChange: drawFram }, values)
createTool({ type: 'range', name: 'cam-rotate-y', min: 0, max: 360, onChange: drawFram }, values)
