const xSlider = document.querySelector('#x-rotate-silder').querySelector('input');
const xValue = document.querySelector('#x-rotate-silder').querySelector('.value');
export const getXRotateDegree = () => {
  xValue.innerHTML = xSlider.value;
  const percent = (xSlider.value) / 360;
  const value = percent * 2 * Math.PI;
  return value;
}

const ySlider = document.querySelector('#y-rotate-silder').querySelector('input');
const yValue = document.querySelector('#y-rotate-silder').querySelector('.value');
export const getYRotateDegree = () => {
  yValue.innerHTML = ySlider.value;
  const percent = (ySlider.value) / 360;
  const value = percent * 2 * Math.PI;
  return value;
}

const zSlider = document.querySelector('#z-rotate-silder').querySelector('input');
const zValue = document.querySelector('#z-rotate-silder').querySelector('.value');
export const getZRotateDegree = () => {
  zValue.innerHTML = zSlider.value;
  const percent = (zSlider.value) / 360;
  const value = percent * 2 * Math.PI;
  return value;
}


const longiNum = document.querySelector('#longitude-num').querySelector('input');
const longiNumValue = document.querySelector('#longitude-num').querySelector('.value');
export const getLongitudeNum = () => {
  longiNumValue.innerHTML = longiNum.value;
  return longiNum.value;;
}


const longiPointsNum = document.querySelector('#longitude-point').querySelector('input');
const longiPointsNumValue = document.querySelector('#longitude-point').querySelector('.value');
export const getLongitudePointNum = () => {
  longiPointsNumValue.innerHTML = longiPointsNum.value;
  return longiPointsNum.value;
}
