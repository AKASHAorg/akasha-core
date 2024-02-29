import { VirtualItem } from './virtual-item-renderer';

export class Rect {
  readonly #top: number;
  readonly #height: number;
  constructor(top: number, height: number) {
    this.#top = top;
    this.#height = height;
  }
  getTop = () => this.#top;
  getBottom = () => this.#top + this.#height;
  getHeight = () => this.#height;
  overlaps = (target: Rect) => {
    const targetTop = target.getTop();
    const targetBottom = target.getBottom();

    return (
      (this.getTop() >= targetTop && this.getTop() < targetBottom) ||
      (targetTop >= this.getTop() && targetTop < this.getBottom())
    );
  };

  translateRelativeTo = (node: HTMLElement) => {
    if (node) {
      return this.translate(-node.getBoundingClientRect().top);
    }
  };

  translate = (top: number, height = 0) => {
    return new Rect(this.getTop() + top, this.getHeight() + height);
  };

  static fromItem = (item: VirtualItem) => new Rect(item.start, item.height);
  static visibleFactor = (rect: Rect, containerRect: Rect) => {
    const visibleHeight = Math.max(
      0,
      Math.min(rect?.getBottom(), containerRect?.getBottom()) -
        Math.max(rect?.getTop(), containerRect?.getTop()),
    );
    const fraction = rect.getHeight() > 0 ? visibleHeight / rect.getHeight() : 0;
    return fraction > 0.01 ? 1 : 0;
  };
  static getVisibleHeight = (rect: Rect, container: Rect) => {
    return rect?.getBottom() - container?.getTop();
  };
}
