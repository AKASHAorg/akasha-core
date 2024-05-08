interface IGqlClient<T> {
  getAPI(withCache: boolean): T;
}

export default IGqlClient;
