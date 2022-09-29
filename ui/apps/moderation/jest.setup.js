const { mockSDK } = require('@akashaorg/af-testing');

require('@testing-library/jest-dom/extend-expect');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});

/*TODO: This mock should be removed when using proper babel plugin */
jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    ENTRY: 0,
    PROFILE: 1,
    COMMENT: 2,
    TAG: 3,
  },
  ModerationItemTypes: {
    ACCOUNT: 'account',
    POST: 'post',
    COMMENT: 'comment',
    REPLY: 'reply',
  },
}));
