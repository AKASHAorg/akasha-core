import * as mediaHooks from '@akashaorg/ui-awf-hooks/lib/utils/media-utils';

require('@testing-library/jest-dom/extend-expect');

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
}));

jest
  .spyOn(mediaHooks, 'getMediaUrl')
  .mockReturnValue({ originLink: '', fallbackLink: '', pathLink: '' });
