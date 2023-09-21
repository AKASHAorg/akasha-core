import { renderHook } from '@testing-library/react-hooks';
import { useEntryNavigation } from '../use-navigation';
import { createWrapper } from './utils';

jest.mock('@akashaorg/typings/lib/ui', () => ({
  EntityTypes: {
    POST: 0,
  },
}));

const navigateTo = jest.fn();

describe('useNavigation', () => {
  it('should correctly call the navigate fn', () => {
    const [wrapper] = createWrapper();

    const { result } = renderHook(() => useEntryNavigation(navigateTo), { wrapper });
    result.current(
      {
        authorId: '0x00',
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
