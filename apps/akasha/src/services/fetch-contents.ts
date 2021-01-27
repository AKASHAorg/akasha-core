import { BASE_DECISION_URL } from './constants';
import { useRequest } from '@akashaproject/ui-awf-hooks';

export const checkDelisted = async (entryId: string) => {
  try {
    const [fetchItem] = await useRequest({
      method: 'HEAD',
      url: `${BASE_DECISION_URL}/delisted/${entryId}`,
    });

    const response = await fetchItem();

    if (response === 200) {
      return true;
    } else if (response === 404) {
      return false;
    } else {
      throw new Error('An error occured. Please try again later');
    }
  } catch (error) {
    return error;
  }
};
