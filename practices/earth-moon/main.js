import { draw } from "./draw.js";
import { initProgram } from './program.js';
import { initBuffers } from './buffer.js';
import { initTexture, loadImages } from "./texture.js";

const gl = document.querySelector('#gl-canvas').getContext('webgl');
const programInfo = initProgram(gl);
const buffers = initBuffers(gl);
let textures = [];

const drawFrame = () => {
  draw(gl, programInfo, buffers, textures);
  window.requestAnimationFrame(() => drawFrame())
}

loadImages(['./2k_earth_daymap.jpeg', 'lroc_color_poles_1k.jpeg'], (images) => {
  textures = initTexture(gl, images);
  drawFrame()
})