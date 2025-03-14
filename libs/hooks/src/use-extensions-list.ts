import * as React from 'react';
import { useGetAppsByIdLazyQuery } from './generated/apollo';
import { selectAppData } from './selectors/get-apps-by-id-query';

/**
 * Hook to retrieve a list of extensions data.
 * @param extensionIds - string array representing the ids of the extensions to be fetched
 * @returns { extensionsData  } - array containg the extension data for each extension id queried
 * @example useExtensionList hook
 * ```typescript
 * const { extensionsData } = useExtensionList(['id1, id2]);
 * ```
 **/
const useExtensionsList = (extensionIds: string[]) => {
  const [extensionsData, setExtensionsData] = React.useState([]);

  const [extensionDataReq, { loading, error }] = useGetAppsByIdLazyQuery();
  const fetchData = async () => {
    const results = await Promise.all(
      extensionIds?.map(id =>
        extensionDataReq({ variables: { id: id }, fetchPolicy: 'cache-first' }),
      ),
    );
    const extensions = results.map(res => selectAppData(res.data));
    setExtensionsData(extensions);
  };
  React.useEffect(() => {
    if (extensionIds?.length > 0) {
      fetchData();
    }
  }, [extensionIds]);

  return { extensionsData, loading, error };
};

export { useExtensionsList };
