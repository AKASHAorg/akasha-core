export enum AnalyticsEventTypes {
  ENABLE_TRACKING = 'analytics:enable-tracking',
  TRACK_EVENT = 'analytics:track-event',
}

export type AnalyticsEventData = {
  event: AnalyticsEventTypes;
  data: {
    category: AnalyticsCategories;
    action?: string;
    name?: string;
    value?: string;
  };
};

export enum AnalyticsCategories {
  APPS = 'Apps',
  BROWSE = 'Browse',
  EXPLORE = 'Explore',
  FILTER_SEARCH = 'Filter Search',
  MY_APPS = 'My Apps',
  PEOPLE = 'People',
  BEAM = 'Beam',
  REFLECT = 'Reflect',
  SIGN_IN = 'Sign In',
  SIGN_UP = 'Sign Up',
  SIGN_UP_WALLET = 'Sign Up Wallet',
  TRENDING_PEOPLE = 'Trending People',
  TRENDING_TOPIC = 'Trending Topic',
  TRENDING_WIDGET = 'Trending Widget',
  WIDGETS = 'Widgets',
  INVITATION_CODE = 'Invitation Code',
  MESSAGING = 'Messaging',
}
