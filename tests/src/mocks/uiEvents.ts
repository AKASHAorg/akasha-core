import { Subject } from 'rxjs';
import { UIEventData } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { AnalyticsEventData } from '@akashaorg/ui-awf-typings/lib/analytics';

export const uiEventsMock = new Subject<UIEventData | AnalyticsEventData>();
