import { checkEntryActive } from '../utils/checkEntryActive';

const textContext = {
  provider: 'AkashaApp',
  property: 'textContent',
  value: 'VGhpcyBpcyBzdXBlciBjb29sISDwn6SXICBHcmVhdCB3b3JrIGV2ZXJ5b25lISDwn5Kq8J+SqvCfkqo=',
};

describe('checkPostAcitve', () => {
  it('should return true for an active post', async () => {
    expect(
      checkEntryActive({
        content: [textContext],
        delisted: false,
      }),
    ).toBe(true);
  });

  it('should return false for inactive post that is either delisted, removed or both', async () => {
    expect(
      checkEntryActive({
        content: [textContext],
        delisted: true,
      }),
    ).toBe(false);
    expect(
      checkEntryActive({
        content: [{ property: 'removed', provider: 'sample-provider', value: '1' }],
      }),
    ).toBe(false);
    expect(
      checkEntryActive({
        content: [{ property: 'removed', provider: 'sample-provider', value: '1' }],
        delisted: true,
      }),
    ).toBe(false);
  });
});
