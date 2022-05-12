export enum AnalyticsEventTypes {
  ENABLE_TRACKING = 0,
  TRACK_EVENT,
  SEARCH_EVENT,
}

export interface EnableTrackingEvent {
  eventType: AnalyticsEventTypes.ENABLE_TRACKING;
}

export interface TrackEventData {
  eventType: AnalyticsEventTypes.TRACK_EVENT;
  category: AnalyticsCategories;
  action?: string;
  name?: string;
  value?: string;
}

export type AnalyticsEventData = TrackEventData | EnableTrackingEvent;

export enum AnalyticsCategories {
  APPS = 'Apps',
  BROWSE = 'Browse',
  EXPLORE = 'Explore',
  FILTER_SEARCH = 'Filter Search',
  MY_APPS = 'My Apps',
  PEOPLE = 'People',
  POST = 'Post',
  REPLY = 'Reply',
  REPOST = 'Repost',
  SIGN_IN = 'Sign In',
  SIGN_UP = 'Sign Up',
  SIGN_UP_WALLET = 'Sign Up Wallet',
  TRENDING_PEOPLE = 'Trending People',
  TRENDING_TOPIC = 'Trending Topic',
  TRENDING_WIDGET = 'Trending Widget',
  WIDGETS = 'Widgets',
  INVITATION_CODE = 'Invitation Code',
}
