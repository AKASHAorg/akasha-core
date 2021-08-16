import getSDK from '@akashaproject/awf-sdk';
import constants from './constants';

const sdk = getSDK();

const { BASE_REPORT_URL, BASE_STATUS_URL, BASE_DECISION_URL, BASE_MODERATOR_URL } = constants;

export const fetchRequest = async (props: {
  method: string;
  url: string;
  data?: Record<string, unknown>;
  statusOnly?: boolean;
}) => {
  const { method, url, data = {}, statusOnly = false } = props;
  const rheaders = new Headers();
  rheaders.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: method,
    headers: rheaders,
    ...(method === ('POST' || 'PUT' || 'PATCH') && { body: JSON.stringify(data) }),
  });

  if (method === 'HEAD' || (method === 'POST' && statusOnly)) {
    return response.status;
  }

  return response.json();
};

export default {
  checkModerator: async (loggedUser: string) => {
    try {
      const response = await fetchRequest({
        method: 'HEAD',
        url: `${BASE_MODERATOR_URL}/${loggedUser}`,
      });
      return response;
    } catch (error) {
      return error;
    }
  },
  checkStatus: async (isBatch: boolean, data: Record<string, unknown>, entryId?: string) => {
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
  getLog: async (data?: { offset?: string; limit?: number }) => {
    try {
      const response = await fetchRequest({
        method: 'POST',
        url: `${BASE_DECISION_URL}/log`,
        data,
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

      const modResponse = response.results.map(
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

      const modResponse = [...delistedItems.results, ...keptItems.results].map(
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
  modalClickHandler: async ({
    dataToSign,
    contentId,
    contentType,
    url,
    modalName,
    logger,
    callback,
    setRequesting,
  }) => {
    setRequesting(true);

    sdk.api.auth.signData(dataToSign).subscribe(async (resp: any) => {
      const data = {
        contentId,
        contentType,
        data: dataToSign,
        signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
      };

      fetchRequest({ url, data, method: 'POST', statusOnly: true })
        .then(status => {
          if (status === 409) {
            throw new Error(
              `This content has already been ${
                modalName === 'report-modal' ? 'reported' : 'moderated'
              } by you`,
            );
          } else if (status === 403) {
            throw new Error('You are not authorized to perform this operation');
          } else if (status === 400) {
            throw new Error('Bad request. Please try again later');
          } else if (status >= 400) {
            throw new Error('Unable to process your request right now. Please try again later');
          }

          return modalName === 'report-modal' ? callback(true) : callback();
        })
        .catch(error =>
          logger.error(`[${modalName}.tsx]: fetchRequest err %j`, error.message || ''),
        )
        .finally(() => setRequesting(false));
    });
  },
};
