import { snackBarType } from './index';

export function getColorLight(type: snackBarType) {
  switch (type) {
    case 'alert':
      return 'errorLight';
    case 'caution':
      return 'warningLight';
    case 'success':
      return 'success';
    case 'info':
      return 'secondaryLight';
  }
}

export function getColorDark(type: snackBarType) {
  switch (type) {
    case 'alert':
      return 'errorDark';
    case 'caution':
      return 'warningDark';
    case 'success':
      return 'success';
    case 'info':
      return 'secondaryDark';
  }
}
