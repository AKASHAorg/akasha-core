import { mergeWithCache } from '../virtual-list-utils';

const vItemCommon = {
  end: 0,
  start: 0,
  size: 100,
  lane: 0,
};

describe('merge-with-cache', () => {
  it('should merge when cache is longer', () => {
    const merged = mergeWithCache(
      [
        { key: 'abc', index: 0, ...vItemCommon },
        { key: 'cde', index: 1, ...vItemCommon },
      ],
      [{ cursor: 'abc', node: {} }],
    );
    expect(merged).toHaveLength(2);
    expect(merged[0]).toStrictEqual({
      key: 'abc',
      index: 0,
      node: {},
      cursor: 'abc',
      ...vItemCommon,
    });
    expect(merged[1]).toStrictEqual({
      key: 'cde',
      index: 1,
      ...vItemCommon,
    });
  });
  it('should merge when pages longer than cache', () => {
    const merged = mergeWithCache(
      [{ key: 'abc', index: 0, ...vItemCommon }],
      [
        { cursor: 'def', node: {} },
        { cursor: 'fed', node: {} },
        { cursor: 'abc', node: {} },
      ],
    );
    expect(merged).toHaveLength(3);
    expect(merged[0]).toStrictEqual({
      key: 'abc',
      index: 0,
      cursor: 'abc',
      node: {},
      ...vItemCommon,
    });
    expect(merged[1]).toStrictEqual({ key: 'def', cursor: 'def', index: 1, node: {} });
    expect(merged.map(m => m.key)).toStrictEqual(['abc', 'def', 'fed']);
  });
  it('should merge when there are gaps in pages', () => {
    const merged = mergeWithCache(
      [
        { key: 'abc', index: 0, ...vItemCommon },
        { key: 'def', index: 1, ...vItemCommon },
      ],
      [
        { cursor: 'abc', node: {} },
        { cursor: 'ghi', node: {} },
      ],
    );
    expect(merged.map(m => m.key)).toStrictEqual(['abc', 'def', 'ghi']);
  });
  it('should merge when there are gaps in cache', () => {
    const merged = mergeWithCache(
      [
        { key: 'abc', index: 0 },
        { key: 'def', index: 1 },
        { key: 'jkl', index: 3 },
      ].map(i => ({ ...i, ...vItemCommon })),
      [
        { cursor: 'abc', node: {} },
        { cursor: 'def', node: {} },
        { cursor: 'ghi', node: {} },
        {
          cursor: 'jkl',
          node: {},
        },
      ],
    );
    expect(merged.map(m => m.key)).toStrictEqual(['abc', 'def', 'jkl', 'ghi']);
    expect(merged[merged.length - 1].index).toEqual(merged.length - 1);
  });
});
