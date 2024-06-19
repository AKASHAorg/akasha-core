import { renderHook } from '@testing-library/react-hooks';
import { useEntryNavigation } from '../use-navigation';

jest.mock('@akashaorg/typings/lib/ui', () => ({
  EntityTypes: {
    POST: 0,
  },
}));

const navigateTo = jest.fn();

describe('useNavigation', () => {
  it('should correctly call the navigate fn', () => {
    const { result } = renderHook(() => useEntryNavigation(navigateTo));
    result.current(
      {
        authorId: '0x00',
        id: 'blah',
      },
      0,
    );
    expect(navigateTo).toHaveBeenCalledWith({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: expect.any(Function),
    });
  });
});
