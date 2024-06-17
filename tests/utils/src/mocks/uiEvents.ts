import { Subject } from 'rxjs';
import { UIEventData } from '@akashaorg/typings/lib/ui';

export const uiEventsMock = new Subject<UIEventData>();
