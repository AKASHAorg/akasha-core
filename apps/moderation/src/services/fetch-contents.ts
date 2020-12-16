import { BASE_URL } from './constants';
import postRequest from './post-request';

export const getAllPending = async () => {
  try {
    const response = await postRequest(`${BASE_URL}/pending`);

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
          description: '',
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

export const getAllDelisted = async () => {
  try {
    const response = await postRequest(`${BASE_URL}/moderated`, {
      delisted: true,
    });

    const modResponse = response.map(
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
          reporter: reportedBy,
          moderator: moderator, // @TODO: fetch reporter's Name and ENS (if applicable) from the profile API
          entryDate: reportedDate,
          evaluationDate: date,
        };
      },
    );
    return modResponse;
  } catch (error) {
    return error;
  }
};
