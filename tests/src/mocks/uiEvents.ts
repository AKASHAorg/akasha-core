import { Subject } from 'rxjs';
import { UIEventData, AnalyticsEventData } from '@akashaorg/typings/ui';

export const uiEventsMock = new Subject<UIEventData | AnalyticsEventData>();
