import { draw } from "./draw.js";
import { initProgram } from './program.js';
import { initBuffers } from './buffers.js';
import { initTexture } from "./texture.js";

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const buffers = initBuffers(gl);
initTexture(gl, './lroc_color_poles_1k.jpeg').then((tex) => {
  drawFrame(tex)
})

const drawFrame = (texture) => {
  draw(gl, programInfo, buffers, texture);
  window.requestAnimationFrame(() => drawFrame(texture))
}