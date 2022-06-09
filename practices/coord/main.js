import { initProgram } from "./program.js";
import { draw } from './draw.js';
import { initBuffers as initConeBuffer } from '../cone/buffer.js'
import { initBuffer as initCylinderBuffer } from '../cylinder/buffer.js'
import { createTool } from "../../lib/utils.js";

const gl = document.querySelector('#gl-canvas').getContext('webgl');

const programInfo = initProgram(gl);
const coneBuffer = initConeBuffer(gl);
const cylinderBuffer = initCylinderBuffer(gl);

const values = {};


export const drawFram = (_gl) => {
  draw(_gl, programInfo, { coneBuffer, cylinderBuffer }, values);
}

drawFram(gl);

createTool({ type: 'range', name: 'cam-rotate-y', min: 0, max: 360, onChange: drawFram }, values)
createTool({ type: 'range', name: 'cam-trans-z', min: -2, max: 100, onChange: drawFram }, values)