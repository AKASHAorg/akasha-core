import { Observer, Subject, Subscription } from 'rxjs';

export default interface ITransport {
  channel: string;
  channelName: string;
  subscribers: Map<Function, Subscription>;
  subject: Subject<any>;
  observer: Observer<any>;
  options: Object;
  readonly listenerCount: number;

  /**
   *
   * @param observer
   */
  bind (observer: Observer<any>): void;

  /**
   *
   * @param data
   */
  send (data: Object): void;

  /**
   *
   * @param cb
   */
  on (cb: Function): void;

  /**
   *
   * @param cb
   */
  once (cb: CallableFunction): void;

  /**
   *
   * @param listener
   */
  removeListener (listener: Function): void;

  /**
   *
   */
  removeAllListeners (): void;
}
