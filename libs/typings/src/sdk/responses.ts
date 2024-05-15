import { Observable } from 'rxjs';

export type ServiceCallResult<T> = Observable<{ data: T }>;

export enum PostType {
  DEFAULT,
  ARTICLE,
  APP,
}

export interface VideoPreview_Response {
  url: string;
  secureUrl: string;
  type: string;
  width: string;
  height: string;
}

export interface LinkPreview_Response {
  url: string;
  mediaType: string;
  contentType: string;
  favicons: [string];
  videos: [VideoPreview_Response];
  title: string;
  siteName: string;
  description: string;
  images: [string];
  imagePreviewHash?: string;
  faviconPreviewHash?: string;
}
