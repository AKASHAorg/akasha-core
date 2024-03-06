import { act, renderHook } from '@testing-library/react-hooks';
import { createWrapper } from './utils';
import {
  HAS_NEW_NOTIFICATIONS_KEY,
  NOTIFICATIONS_KEY,
  useCheckNewNotifications,
  useMarkAsRead,
} from '../use-notifications';
import { mockNotifications } from '../__mocks__/notifications';

describe('useNotifications', () => {
  it('should mark notifications as read', async () => {
    const [wrapper, queryClient] = createWrapper();

    const { result } = renderHook(() => useMarkAsRead(), { wrapper });
    queryClient.setQueryData([NOTIFICATIONS_KEY], mockNotifications);
    queryClient.setQueryData([HAS_NEW_NOTIFICATIONS_KEY], true);

    await act(async () => {
      await result.current.mutateAsync(mockNotifications[0].id);
      const notifications =
        queryClient.getQueryData<{ read: boolean }[]>([NOTIFICATIONS_KEY]) || [];

      const hasNewNotifs = queryClient.getQueryData([HAS_NEW_NOTIFICATIONS_KEY]);

      expect(notifications).toHaveLength(4);
      expect(notifications[0].read).toBeTruthy();
      expect(hasNewNotifs).toBeFalsy();
    });
  });

  it('should check for new notifications', async () => {
    const [wrapper] = createWrapper();

    const { result, waitFor } = renderHook(() => useCheckNewNotifications('0x00'), { wrapper });

    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBeTruthy();
  });
});
