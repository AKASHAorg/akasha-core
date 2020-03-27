// @ts-ignore
import Box from '3box';

export const getProfile = async (ethAddress: string) => {
  return Box.getProfile(ethAddress);
};
let box: Box;

export const authenticateBox = async (
  cache: { entries: { has: (arg0: string) => any }; get: (arg0: string) => any },
  web3Instance: { getSigner: () => any },
  web3Utils: { toUtf8String: (arg0: any) => any; joinSignature: (arg0: any) => any },
) => {
  let ethAddress;
  const signer = await web3Instance.getSigner();
  if (cache.entries.has('auth')) {
    const authValue = cache.get('auth');
    if (authValue.hasOwnProperty('ethAddress')) {
      ethAddress = authValue.ethAddress;
    }
  }
  ethAddress = ethAddress || (await signer.getAddress());

  if (Box.isLoggedIn(ethAddress) && box) {
    return box.public.all();
  }
  box = await Box.create({
    sendAsync: function(data: any, cb: any) {
      signer
        .signMessage(web3Utils.toUtf8String(data.params[0]))
        .then((result: any) => cb(null, { result: web3Utils.joinSignature(result) }));
    },
  });
  await box.auth(['akasha-ewa'], { address: ethAddress });
  await box.syncDone;
  const profileData = await box.public.all();
  return {
    ethAddress,
    profileData,
  };
};
