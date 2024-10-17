import * as React from 'react';
import { useGetProfileByDidLazyQuery } from './generated/apollo';
import { selectProfileData } from './selectors/get-profile-by-did-query';

/**
 * Hook to retrieve a list of profiles data.
 * @param profileDIDs - string array representing the DIDs of the profiles to be fetched
 * @returns { profilesData  } - array containg the profile data for each profile DID queried
 * @example useProfileList hook
 * ```typescript
 * const { profilesData } = useProfileList(['did1, did2]);
 * ```
 **/
const useProfilesList = (profileDIDs: string[]) => {
  const [profilesData, setProfilesData] = React.useState([]);

  const [profileDataReq] = useGetProfileByDidLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        profileDIDs.map(did => profileDataReq({ variables: { id: did } })),
      );
      const profiles = results.map(res => selectProfileData(res));
      setProfilesData(profiles);
    };
    fetchData();
  }, [profileDIDs, profileDataReq]);

  return { profilesData };
};

export { useProfilesList };
