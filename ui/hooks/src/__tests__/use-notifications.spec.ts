import { act, renderHook } from '@testing-library/react-hooks';
import { useCheckNewNotifications, useMarkAsRead } from '../use-notifications';
import { mockNotifications } from '../__mocks__/notifications';

describe('useNotifications', () => {
  it('should mark notifications as read', async () => {
    const { result } = renderHook(() => useMarkAsRead());

    await act(async () => {
      const data = await result.current.markAsRead(mockNotifications[0].id);

      expect(data).toBeTruthy();
    });
  });

  it('should check for new notifications', async () => {
    const { result, waitFor } = renderHook(() => useCheckNewNotifications('0x00'));

    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBeTruthy();
  });
});
