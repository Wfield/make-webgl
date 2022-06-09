import { initProgram } from "./program.js";
import { draw } from './draw.js';
import { initBuffers as initConeBuffer } from '../cone/buffer.js'
import { initBuffer as initCylinderBuffer } from '../cylinder/buffer.js'
import { createTool } from "../../lib/utils.js";
import { create, perspective, invert } from "../../lib/math.js";

const gl = document.querySelector('#gl-canvas').getContext('webgl');

const programInfo = initProgram(gl);
const coneBuffer = initConeBuffer(gl);
const cylinderBuffer = initCylinderBuffer(gl);


const projectionMat = create();
const fov = Math.PI / 3;
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
perspective(projectionMat, fov, aspect, 0.1, 100.0);

// 这个矩阵是代表相机在世界坐标中的位置和姿态
const caremaMat = create();
const viewMat = create();
invert(viewMat, caremaMat);

// 可被复用
export const drawFram = (_gl, projectionMat, viewMat) => {
  draw(_gl, programInfo, { coneBuffer, cylinderBuffer }, projectionMat, viewMat);
}

drawFram(gl, projectionMat, viewMat);