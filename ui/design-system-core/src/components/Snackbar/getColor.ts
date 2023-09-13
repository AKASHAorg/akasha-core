import { Colors } from '@akashaorg/typings/lib/ui';
import { SnackBarType } from './index';

export function getColorLight(type: SnackBarType): Colors {
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

export function getColorDark(type: SnackBarType): Colors {
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
