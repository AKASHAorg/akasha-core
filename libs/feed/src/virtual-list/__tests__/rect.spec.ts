import { Rect } from '../rect';
import type { VirtualItem } from '../virtual-item-renderer';

describe('Rect', () => {
  it('should return correct top value', () => {
    const rect = new Rect(10, 20);
    expect(rect.getTop()).toBe(10);
  });

  it('should correctly calculate bottom', () => {
    const rect = new Rect(10, 20);
    expect(rect.getBottom()).toBe(30);
  });

  it('should return correct height value', () => {
    const rect = new Rect(10, 20);
    expect(rect.getHeight()).toBe(20);
  });

  it('should return if is overlapping', () => {
    const rect1 = new Rect(10, 10);
    const rect2 = new Rect(10, 20);
    expect(rect1.overlaps(rect2)).toBe(true);
  });

  it('should return new Rect with translated values', () => {
    const rect = new Rect(10, 20);
    const newRect = rect.translate(5, 10);

    expect(newRect.getTop()).toBe(15);
    expect(newRect.getHeight()).toBe(30);
  });

  it('should return Rect from a VirtualItem', () => {
    const item: VirtualItem = {
      start: 15,
      height: 25,
      key: 'abc1',
      maybeRef: false,
      visible: false,
    };
    const rect = Rect.fromItem(item);

    expect(rect.getTop()).toBe(15);
    expect(rect.getHeight()).toBe(25);
  });

  it('should return valid visibility factor', () => {
    const rect1 = new Rect(10, 20);
    const rect2 = new Rect(15, 25);
    const factor = Rect.visibleFactor(rect1, rect2);

    expect(factor).toBeGreaterThan(0.01);
  });

  it('should return correct visible height', () => {
    const rect1 = new Rect(10, 20);
    const rect2 = new Rect(15, 25);
    const visibleHeight = Rect.getVisibleHeight(rect1, rect2);

    expect(visibleHeight).toBe(25 - 10);
  });
});
