import { renderHook } from '@testing-library/react-hooks';
import { useEntryNavigation } from '../use-navigation';
import { createWrapper } from './utils';
import { mockSDK } from '@akashaorg/af-testing';

const navigateTo = jest.fn();
jest.mock('@akashaorg/awf-sdk', () => () => mockSDK());
jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    POST: 0,
  },
}));

describe('useNavigation', () => {
  it('should correctly call the navigate fn', () => {
    const [wrapper] = createWrapper();

    const { result } = renderHook(() => useEntryNavigation(navigateTo), { wrapper });
    result.current(
      {
        authorEthAddress: '0x00',
        id: 'blah',
      },
      0,
    );
    expect(navigateTo).toHaveBeenCalledWith({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: expect.any(Function),
    });
  });
});
