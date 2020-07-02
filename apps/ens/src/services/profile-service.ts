export const getEthAddress = async (cache: {
  entries: { has: (arg0: string) => any };
  get: (arg0: string) => any;
}): Promise<string> => {
  let ethAddress: string = '';
  if (cache.entries.has('auth')) {
    const authValue = cache.get('auth');
    if (authValue.hasOwnProperty('ethAddress')) {
      ethAddress = authValue.ethAddress;
    }
  }
  return ethAddress;
};
