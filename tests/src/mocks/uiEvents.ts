import { Subject } from 'rxjs';
import { UIEventData, AnalyticsEventData } from '@akashaorg/typings/lib/ui';

export const uiEventsMock = new Subject<UIEventData | AnalyticsEventData>();
