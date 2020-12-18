class Rect {
  public top: number;
  public height: number;
  public resizeListeners: (() => void)[];
  constructor({ top, height }: { top: number; height: number }, listeners?: any[]) {
    this.top = top;
    this.height = height;
    this.resizeListeners = listeners || [];
  }
  addResizeListener(listener: () => void) {
    if (this.resizeListeners.indexOf(listener) < 0) {
      this.resizeListeners.push(listener);
    }
    return () => this.removeResizeListener(listener);
  }
  removeResizeListener(listener: () => void) {
    const idx = this.resizeListeners.indexOf(listener);
    if (idx >= 0) {
      this.resizeListeners.splice(idx, 1);
    }
  }

  getBottom() {
    return this.top + this.height;
  }

  inRange(value: number, from: number, to: number) {
    return from <= value && to > value;
  }

  isIntersectingWith(rect: Rect) {
    return (
      this.inRange(this.top, rect.top, rect.getBottom()) ||
      this.inRange(rect.top, this.top, this.getBottom())
    );
  }
  translateY(y: number) {
    let top = this.top;
    top += y;
    return new Rect({
      top,
      height: this.height,
    });
  }
  update({ top, height }: { top?: number; height?: number }) {
    if (top) {
      this.top = top;
    }
    if (height) {
      this.height = height;
    }
    return new Rect({ top: this.top, height: this.height }, this.resizeListeners);
  }
}

export default Rect;
