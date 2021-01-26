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
      body: JSON.stringify(data),
    });

    return response.json();
  };
  return [fetchRequest];
};

export default useRequest;
