import MarginInterface from '../interfaces/margin.interface';

export default function MarginSetter(marginObj: MarginInterface): string {
  let marginString = '';
  if (marginObj.margin) {
    marginString = `${marginObj.margin}`;
    return marginString;
  }
  if (marginObj.top) {
    marginString += `${marginObj.top} `;
  }
  if (marginObj.left) {
    marginString += `${marginObj.left} `;
  }
  if (marginObj.bottom) {
    marginString += `${marginObj.bottom} `;
  }
  if (marginObj.right) {
    marginString += `${marginObj.right}`;
  }
  return marginString;
}
