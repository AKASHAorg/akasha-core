import { Colors } from '@akashaorg/typings/lib/ui';
import { SnackbarProps } from './index';

export function getColorLight(type: SnackbarProps['type']): Colors {
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

export function getColorDark(type: SnackbarProps['type']): Colors {
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
