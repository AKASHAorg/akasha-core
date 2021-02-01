import { BASE_STATUS_URL } from './constants';

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

export const checkStatus = async (entryId: string, data?: object) => {
  try {
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_STATUS_URL}/${entryId}`,
      data: data,
    });

    return response;
  } catch (error) {
    return error;
  }
};
