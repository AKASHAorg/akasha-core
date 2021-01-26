export interface IUseRequest {
  method: string;
  url: string;
  data?: object;
}

const useRequest = (props: IUseRequest): [any] => {
  const { method, url, data = {} } = props;

  const fetchRequest = async () => {
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
  return [fetchRequest];
};

export default useRequest;
