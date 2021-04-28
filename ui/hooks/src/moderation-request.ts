import constants from './constants';

const { BASE_REPORT_URL, BASE_STATUS_URL, BASE_DECISION_URL, BASE_MODERATOR_URL } = constants;

const fetchRequest = async (props: { method: string; url: string; data?: object }) => {
  const { method, url, data = {} } = props;
  const rheaders = new Headers();
  rheaders.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: method,
    headers: rheaders,
    ...(method === ('POST' || 'PUT' || 'PATCH') && { body: JSON.stringify(data) }),
  });

  if (method === 'HEAD') {
    return response.status;
  }

  return response.json();
};

export default {
  checkModerator: async (loggedUserEthAddress: string) => {
    try {
      const response = await fetchRequest({
        method: 'HEAD',
        url: `${BASE_MODERATOR_URL}/${loggedUserEthAddress}`,
      });
      return response;
    } catch (error) {
      return error;
    }
  },
  checkStatus: async (isBatch: boolean, data: object, entryId?: string) => {
    try {
      const response = await fetchRequest({
        method: 'POST',
        url: `${BASE_STATUS_URL}${!isBatch ? `/${entryId}` : ''}`,
        data: data,
      });

      return response;
    } catch (error) {
      return error;
    }
  },
  getCount: async () => {
    try {
      const response = await fetchRequest({
        method: 'GET',
        url: `${BASE_STATUS_URL}/counters`,
      });

      return response;
    } catch (error) {
      return error;
    }
  },
  getFlags: async (entryId: string) => {
    try {
      const response = await fetchRequest({
        method: 'POST',
        url: `${BASE_REPORT_URL}/list/${entryId}`,
      });

      return response;
    } catch (error) {
      return error;
    }
  },
  getAllPending: async () => {
    try {
      const response = await fetchRequest({
        method: 'POST',
        url: `${BASE_DECISION_URL}/pending`,
      });

      const modResponse = response.map(
        (
          { contentType: type, contentID, reasons, reportedBy, reportedDate, reports }: any,
          idx: number,
        ) => {
          // formatting data to match labels already in use
          return {
            id: idx,
            type: type,
            entryId: contentID,
            reasons: reasons,
            reporter: reportedBy,
            count: reports - 1, // minus reporter, to get count of other users
            entryDate: reportedDate,
          };
        },
      );
      return modResponse;
    } catch (error) {
      return error;
    }
  },
  getAllModerated: async () => {
    try {
      // fetch delisted items
      const delistedItems = await fetchRequest({
        method: 'POST',
        url: `${BASE_DECISION_URL}/moderated`,
        data: {
          delisted: true,
        },
      });

      // fetch kept items
      const keptItems = await fetchRequest({
        method: 'POST',
        url: `${BASE_DECISION_URL}/moderated`,
        data: {
          delisted: false,
        },
      });

      const modResponse = [...delistedItems, ...keptItems].map(
        (
          {
            contentType: type,
            contentID,
            date,
            explanation,
            moderator,
            reasons,
            reportedBy,
            reportedDate,
            reports,
            delisted,
          }: any,
          idx: number,
        ) => {
          // formatting data to match labels already in use
          return {
            id: idx,
            type: type,
            entryId: contentID,
            reasons: reasons,
            description: explanation,
            reporter: reportedBy,
            count: reports - 1,
            moderator: moderator,
            entryDate: reportedDate,
            evaluationDate: date,
            delisted: delisted,
          };
        },
      );
      return modResponse;
    } catch (error) {
      return error;
    }
  },
};
