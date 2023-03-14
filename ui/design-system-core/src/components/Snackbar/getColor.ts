import { snackBarType } from './index';

export function getColorLight(type: snackBarType) {
  switch (type) {
    case 'alert':
      return 'error-light';
    case 'caution':
      return 'warning-light';
    case 'success':
      return 'success';
    case 'info':
      return 'secondary-light';
  }
}

export function getColorDark(type: snackBarType) {
  switch (type) {
    case 'alert':
      return 'error-dark';
    case 'caution':
      return 'warning-dark';
    case 'success':
      return 'success';
    case 'info':
      return 'secondary-dark';
  }
}
