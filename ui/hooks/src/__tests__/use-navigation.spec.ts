import { renderHook } from '@testing-library/react-hooks';
import { useEntryNavigation } from '../use-navigation';
import { createWrapper } from './utils';
import { mockSDK } from '@akashaproject/af-testing';

const navigateTo = jest.fn();
jest.mock('@akashaproject/awf-sdk', () => () => mockSDK());
jest.mock('@akashaproject/ui-awf-typings/lib/app-loader', () => ({
  ItemTypes: {
    ENTRY: 0,
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
      appName: '@akashaproject/app-akasha-integration',
      getNavigationUrl: expect.any(Function),
    });
  });
});
