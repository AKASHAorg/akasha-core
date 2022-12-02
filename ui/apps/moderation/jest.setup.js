import '../jest.setup';

/*TODO: This mock should be removed when using proper babel plugin */
jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    POST: 0,
    PROFILE: 1,
    REPLY: 2,
    TAG: 3,
  },
  ModerationEntityTypesMap: {
    PROFILE: 'account',
    POST: 'post',
    REPLY: 'reply',
  },
}));
