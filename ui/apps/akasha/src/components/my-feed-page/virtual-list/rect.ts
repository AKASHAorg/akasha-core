import { VirtualItemInfo } from './virtual-item';

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
      (targetTop >= this.getTop() && this.getTop() < this.getBottom())
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

  static fromItem = (item: VirtualItemInfo) => new Rect(item.start, item.height);
}
