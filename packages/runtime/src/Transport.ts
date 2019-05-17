import { Observer, Subject, Subscription } from 'rxjs';
import ITransport  from './ITransport';


export default class Transport implements ITransport {
  channel: string;
  channelName: string;
  subscribers: Map<Function, Subscription>;
  subject: Subject<any>;
  observer: Observer<any>;
  readonly options: Object;

  protected constructor (options: {channel: string, channelName: string, other?: Object}) {
    this.channel = options.channel;
    this.channelName = options.channelName;
    this.subject = new Subject();
    this.subscribers = new Map();
    this.options = options.other;
  }

  bind (observer: Observer<any>) {
    this.observer = observer;
  }

  send (data: Object) {
    this.observer.next(data);
  }

  get listenerCount () {
    return this.subject.observers.length || this.subscribers.size;
  }

  on (cb: Function) {
    this.subscribers.set(
      cb,
      this.subject.subscribe(
        (data: any) => cb(null, data), error => cb(error, null)
      )
    );
  }

  once (cb: CallableFunction) {
    const sub = this.subject.subscribe(
      (data) => {
        cb(null, data);
        sub.unsubscribe();
      },
      (error) => {
        cb(error, null);
        sub.unsubscribe();
      }
    );
  }

  removeListener (listener: Function) {
    this.subscribers.get(listener).unsubscribe();
    this.subscribers.delete(listener);
  }

  removeAllListeners () {
    for (const [listener] of this.subscribers) {
      this.removeListener(listener);
    }
    this.subscribers.clear();
  }
}
