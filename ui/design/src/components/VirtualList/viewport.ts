import throttle from 'lodash.throttle';
import Rect from './rect-obj';

class Viewport {
  public offsetTop: number;
  public scrollListeners: ((v: any) => void)[];
  constructor(initialData: { offsetTop: number }) {
    this.offsetTop = initialData.offsetTop || 0;
    this.scrollListeners = [];
    const thScroll = throttle(this.onScroll, 100, { leading: true, trailing: true });
    this.addListener('scroll', thScroll.bind(this));
  }
  onScroll(ev: Event) {
    if (this.scrollListeners.length >= 0) {
      for (let i = this.scrollListeners.length - 1; i >= 0; i--) {
        this.scrollListeners[i](ev);
      }
    }
  }
  updateTopOffset(offset: number) {
    this.offsetTop = offset;
  }
  getHeight() {
    return Math.ceil(window.document.documentElement.clientHeight);
  }

  getScrollTop() {
    return window.document.documentElement.scrollTop;
  }

  addListener(evName: string, listener: (ev: Event) => void) {
    const cb = (event: Event) => {
      listener(event);
    };

    window.addEventListener(evName, cb);

    return () => {
      window.removeEventListener(evName, cb);
    };
  }

  addScrollListener(listener: (ev: Event) => void) {
    const unlisten = this.addListener('scroll', listener);
    if (this.scrollListeners.indexOf(listener) < 0) {
      this.scrollListeners.push(listener);
    }
    return () => {
      unlisten();
      this.removeScrollListener(listener);
    };
  }
  getBottom() {
    return this.getScrollTop() + this.getHeight();
  }
  removeScrollListener(listener: (ev: Event) => void) {
    const idx = this.scrollListeners.indexOf(listener);
    if (idx >= 0) {
      this.scrollListeners.splice(idx, 1);
    }
  }

  getRect() {
    return new Rect({ height: this.getHeight(), top: this.getScrollTop() });
  }

  scrollBy(y: number) {
    window.scrollBy(0, y);
    this.scrollListeners.forEach(l => l(y));
  }

  scrollTo(y: number) {
    window.scrollTo(0, y);
  }
}

export default Viewport;
