import { injectable } from 'inversify';
import { ReplaySubject } from 'rxjs';

@injectable()
export default class EventBus extends ReplaySubject<{
  data: unknown;
  event: string;
}> {
  constructor(size = 42, time = 15000) {
    super(size, time);
  }
}
