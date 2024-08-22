import { BehaviorSubject, filter, NextObserver, Subscription } from 'rxjs';
import getSdk from '@akashaorg/core-sdk';
import { AUTH_EVENTS, GlobalEventBusData } from '@akashaorg/typings/lib/sdk';
import { IRootComponentProps } from '@akashaorg/typings/lib/ui';

type Listener = (data: unknown) => void;

export class NotificationPlugin {
  notificationPool: Record<string, BehaviorSubject<unknown>>;
  listeners: Record<string, Listener[]>;
  logger: IRootComponentProps['logger'];
  user?: GlobalEventBusData['data'];
  loginListeners: Listener[];
  constructor(props: IRootComponentProps) {
    this.notificationPool = {};
    this.listeners = {};
    this.logger = props.logger;
    this.user = null;
    this.loginListeners = [];
    this.subscribeLogin();
  }

  private subscribeLogin = () => {
    const sdk = getSdk();
    sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === AUTH_EVENTS.READY;
        }),
      )
      .subscribe({
        next: payload => {
          const { data } = payload;
          if (this.loginListeners.length > 0) {
            this.loginListeners.forEach(listener => listener(data));
          }
          this.user = data;
        },
        error: err => {
          this.logger.warn(err);
        },
      });
  };

  notify = (domain: string, message: unknown) => {
    if (!this.user) {
      this.logger.warn('Cannot notify without user!');
      return;
    }
    if (this.notificationPool[domain]) {
      this.notificationPool[domain].next(message);
    } else {
      // note that this might be called after the listeners are registered.
      // so we need to subscribe listeners
      this.notificationPool[domain] = new BehaviorSubject(null);
      for (const listener of this.listeners[domain] || []) {
        this.notificationPool[domain].subscribe(listener);
      }
      this.notificationPool[domain].next(message);
    }
  };
  /**
   * Get all notifications for a domain
   */
  getNotifications = (domain: string, subscriber: NextObserver<unknown>) => {
    return this.notificationPool[domain].subscribe(subscriber);
  };

  listen = (domain: string, listener: Listener): Subscription => {
    // add a check here to not confuse generic listeners with login listeners
    if (domain === 'login') {
      this.logger.warn('Cannot listen to login events. Use .listenLogin instead');
      return;
    }

    if (!this.listeners[domain]) {
      this.listeners[domain] = [];
    }

    this.listeners[domain].push(listener);
    if (this.notificationPool[domain]) {
      return this.notificationPool[domain].subscribe(listener);
    }
  };
  listenLogin = (listener: Listener) => {
    if (this.user) {
      listener(this.user);
    }
    this.loginListeners.push(listener);
  };
}
