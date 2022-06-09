// degree to radian(弧度)
export function degToRad(d) {
  return d ? d * Math.PI / 180 : 0;
}


/**
 * 清空画布并设置颜色, 默认颜色 (0.0, 0.0, 0.0, 1.0)
 * @param gl 
 * @param color [r, g, b]
 */
export function clearCanvasToColor(gl, color = []) {
  const r = color[0] || 0.0;
  const g = color[1] || 0.0;
  const b = color[2] || 0.0;

  gl.clearColor(r, g, b, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export const drawElementPosition = (gl, programInfo, buffer, modelMat, type) => {
  const { pos } = programInfo.attribLocations;
  const { uniformLocations } = programInfo;
  const drawType = type || gl.TRIANGLES;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pos);
  gl.uniformMatrix4fv(uniformLocations.modelMat, false, modelMat);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
  gl.drawElements(drawType, buffer.elementNum, gl.UNSIGNED_SHORT, 0);
}

export const drwaElementColor = (gl, programInfo, buffer) => {
  const { color } = programInfo.attribLocations;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(color);
}
/**
 * 
 * @param inputOption - ElementCreationOptions
 */
export function createTool(inputOption, valueContainer) {
  const { type, name, min, max, defaultValue, onChange, percision, step } = inputOption;
  const toolWrap = document.querySelector('#tools');

  const oneTool = document.createElement('div');
  oneTool.className = 'one-tool';

  const label = document.createElement('label');
  label.innerHTML = name;

  const input = document.createElement('input');
  const defaultVal = defaultValue === 0 ? defaultValue : (defaultValue || min);
  input.type = type;
  input.name = name;
  input.max = max;
  input.min = min;
  input.percision = percision;
  input.step = step;
  input.value = defaultVal;
  valueContainer[name] = defaultVal;

  const span = document.createElement('span');
  span.innerHTML = defaultVal

  function valueChangeCallback() {
    span.innerHTML = input.value;
    valueContainer[name] = input.value;
    onChange()
  }

  input.addEventListener('input', valueChangeCallback);
  input.addEventListener('change', valueChangeCallback);


  oneTool.appendChild(label);
  oneTool.appendChild(input);
  oneTool.appendChild(span);

  toolWrap.appendChild(oneTool);

}