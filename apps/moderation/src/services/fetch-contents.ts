import { BASE_DECISION_URL, BASE_FLAG_URL } from './constants';
import postRequest from './post-request';

export const getFlags = async (entryId: string) => {
  try {
    const response = await postRequest(`${BASE_FLAG_URL}/list/${entryId}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getAllPending = async () => {
  try {
    const response = await postRequest(`${BASE_DECISION_URL}/pending`);

    const modResponse = response.map(
      (
        { contentType: type, contentId, reasons, reportedBy, reportedDate, reports }: any,
        idx: number,
      ) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: type,
          entryId: contentId,
          reasons: reasons,
          reporter: reportedBy, // @TODO: fetch reporter's Name and ENS Name (if applicable) from the profile API
          count: reports - 1, // minus reporter, to get count of other users
          entryDate: reportedDate,
        };
      },
    );
    return modResponse;
  } catch (error) {
    return error;
  }
};

export const getAllModerated = async () => {
  try {
    // fetch delisted items
    const delistedItems = await postRequest(`${BASE_DECISION_URL}/moderated`, {
      delisted: true,
    });

    // fetch kept items
    const keptItems = await postRequest(`${BASE_DECISION_URL}/moderated`, {
      delisted: false,
    });

    const modResponse = [...delistedItems, ...keptItems].map(
      (
        {
          contentType: type,
          contentId,
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
          entryId: contentId,
          reasons: reasons,
          description: explanation,
          reporter: reportedBy, // @TODO: fetch reporter's Name and ENS (if applicable) from the profile API
          count: reports - 1,
          moderator: moderator, // @TODO: fetch moderator's Name and ENS (if applicable) from the profile API
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
};
