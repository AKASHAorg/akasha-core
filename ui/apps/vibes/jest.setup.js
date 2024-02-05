import '../jest.setup';

/*TODO: This mock should be removed when using proper babel plugin */
jest.mock('@akashaorg/typings/lib/ui', () => ({
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
  APP_ICON_TO_HERO_ICON_MAP: {
    appSocial: 'akasha',
    appCenter: 'SquaresPlusIcon',
    appModeration: 'UsersIcon',
    bookmark: 'BookmarkIcon',
    chatBubble: 'ChatBubbleOvalLeftEllipsisIcon',
    explore: 'SparklesIcon',
    message: 'EnvelopeIcon',
    notifications: 'BellIcon',
    search: 'MagnifyingGlassIcon',
    settingsAlt: 'Cog8ToothIcon',
  },
}));
