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
  category: string;
  action?: string;
  name?: string;
  value?: string;
}

export type AnalyticsEventData = TrackEventData | EnableTrackingEvent;
