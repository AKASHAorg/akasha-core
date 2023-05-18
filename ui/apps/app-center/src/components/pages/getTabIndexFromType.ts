import { AkashaVerseType } from './page-by-type';

export const getTabIndexFromType = (type: AkashaVerseType) => {
  switch (type) {
    case 'explore':
      return 0;
    case 'my-apps':
      return 1;
    case 'widgets':
      return 2;
  }
};
