const cSlider = document.querySelector('#camera-rotate').querySelector('input');
const cValue = document.querySelector('#camera-rotate').querySelector('.value');
export const getRotateDegree = () => {
  cValue.innerHTML = cSlider.value;
  const percent = (cSlider.value) / 360;
  const value = percent * 2 * Math.PI;
  return value;
}

const zSlider = document.querySelector('#camera-z').querySelector('input');
const zValue = document.querySelector('#camera-z').querySelector('.value');
export const getCameraZ = () => {
  zValue.innerHTML = zSlider.value;
  return zSlider.value;
}
