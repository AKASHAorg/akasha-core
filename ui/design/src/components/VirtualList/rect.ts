const between = (value: number, begin: number, end: number) => value >= begin && value < end;

export class Rect {
  private top: number;
  private height: number;
  constructor(props: { top: number; height: number }) {
    this.top = props.top;
    this.height = props.height;
  }
  getTop() {
    return this.top;
  }
  getBottom() {
    return this.top + this.height;
  }
  getCenter() {
    return this.top + this.height / 2;
  }
  getHeight() {
    return this.height;
  }
  doesIntersectWith(rect: Rect) {
    return (
      between(this.getTop(), rect.getTop(), rect.getBottom()) ||
      between(rect.getTop(), this.getTop(), this.getBottom())
    );
  }
  contains(value: number) {
    return between(value, this.getTop(), this.getBottom());
  }
  translateBy(height: number, top: number) {
    return new Rect({ top: this.getTop() + top, height: this.getHeight() + height });
  }
}
