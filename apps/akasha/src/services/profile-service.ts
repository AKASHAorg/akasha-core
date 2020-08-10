export const fetchProfileData = () => {};

export const getEthAddress = async (
  cache: { entries: { has: (arg0: string) => any }; get: (arg0: string) => any },
  web3Instance: { getSigner: () => any },
) => {
  let ethAddress: string = '';
  const signer = await web3Instance.getSigner();
  if (cache.entries.has('auth')) {
    const authValue = cache.get('auth');
    if (authValue.hasOwnProperty('ethAddress')) {
      ethAddress = authValue.ethAddress;
    }
  }
  if (!ethAddress) {
    try {
      ethAddress = await signer.getAddress();
    } catch (err) {
      throw new Error('Cannot get ethereum address!');
    }
  }
  return ethAddress;
};
