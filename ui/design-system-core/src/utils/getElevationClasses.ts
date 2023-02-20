import { Elevation } from '../components/types/common.types';

export function getElevationClasses(elevation: Elevation) {
  switch (elevation) {
    case 'none':
      return '';
    case '1':
      return 'shadow-[0_0_4px_rgba(0,0,0,0.2)]';
  }
}
