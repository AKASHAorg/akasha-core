import * as React from 'react';
import { useBoxProfile } from '../state';

const MyBoxProfile: React.FC<any> = ({ sdkModules, channelUtils }) => {
  const [state, actions] = useBoxProfile(sdkModules, channelUtils);
  return (
    <>
      <div>{state.data.name}</div>
      {state.data.image && (
        <div>
          <img
            width={'250px'}
            src={`https://ipfs.io/ipfs/${state.data.image['/']}`}
            alt={'avatar'}
          />
        </div>
      )}
      <div>{state.data.coverPhoto}</div>
      <div>{state.data.description}</div>
      <button onClick={() => actions.fetchCurrent()} type="button">
        Fetch current
      </button>
    </>
  );
};

export default MyBoxProfile;
