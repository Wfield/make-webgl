// degree to radian(弧度)
export function degToRad(d) {
  return d * Math.PI / 180;
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

/**
 * 
 * @param inputOption - ElementCreationOptions
 */
export function createTool(inputOption, valueContainer) {
  const { type, name, min, max, onChange, percision, step } = inputOption;
  const toolWrap = document.querySelector('#tools');

  const oneTool = document.createElement('div');
  oneTool.className = 'one-tool';

  const label = document.createElement('label');
  label.innerHTML = name;

  const input = document.createElement('input');
  const defaultVal = min
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