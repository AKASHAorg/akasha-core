import MarginInterface from '../interfaces/margin.interface';

// tslint:disable-next-line:function-name
export default function MarginSetter(marginObj: MarginInterface): string {
  let marginString = '';
  if (marginObj.margin) {
    marginString = `margin: ${marginObj.margin}`;
    return marginString;
  }
  if (marginObj.top) {
    marginString += `margin-top: ${marginObj.top}; `;
  }
  if (marginObj.left) {
    marginString += `margin-left: ${marginObj.left}; `;
  }
  if (marginObj.bottom) {
    marginString += `margin-bottom: ${marginObj.bottom}; `;
  }
  if (marginObj.right) {
    marginString += `margin-right: ${marginObj.right};`;
  }
  return marginString;
}
