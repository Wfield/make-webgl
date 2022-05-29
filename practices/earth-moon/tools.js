const cSlider = document.querySelector('#camera-rotate').querySelector('input');
const cValue = document.querySelector('#camera-rotate').querySelector('.value');
export const getCameraRotateDegree = () => {
  cValue.innerHTML = cSlider.value;
  const percent = (cSlider.value) / 360;
  const value = percent * 2 * Math.PI;
  return value;
}
