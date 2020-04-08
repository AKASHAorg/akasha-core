// @ts-ignore
import Box from '3box';
// @ts-ignore
import boxConfig from '3box/lib/config';

export const getProfile = async (ethAddress: string) => {
  return Box.getProfile(ethAddress);
};
let box: Box;
export const getEthAddress = async (
  cache: { entries: { has: (arg0: string) => any }; get: (arg0: string) => any },
  web3Instance: { getSigner: () => any },
): Promise<string> => {
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

export const authenticateBox = async (
  cache: { entries: { has: (arg0: string) => any }; get: (arg0: string) => any },
  web3Instance: { getSigner: () => any },
  web3Utils: { toUtf8String: (arg0: any) => any; joinSignature: (arg0: any) => any },
  onBoxOpenConsent: () => void,
  onOpenSpaceConsent: () => void,
) => {
  try {
    const ethAddress = await getEthAddress(cache, web3Instance);
    const signer = await web3Instance.getSigner();
    if (Box.isLoggedIn(ethAddress) && box) {
      await box.syncDone;
      const profile = await box.public.all();
      return {
        ethAddress,
        profile,
      };
    }

    const settings = getBoxSettings(ethAddress);

    box = await Box.create(
      {
        sendAsync: function sendAsync(data: any, cb: any) {
          signer
            .signMessage(web3Utils.toUtf8String(data.params[0]))
            .then((result: any) => cb(null, { result: web3Utils.joinSignature(result) }));
        },
      },
      {
        pinningNode: settings.pinningNode,
        addressServer: settings.addressServer,
      },
    );
    await box.auth([], { consentCallback: onBoxOpenConsent, address: ethAddress });
    const space = await box.openSpace('akasha-ewa', { consentCallback: onOpenSpaceConsent });
    await box.syncDone;
    await space.syncDone;
    const profileData = await box.public.all();
    return {
      ethAddress,
      profileData,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateBoxData = async (profileData: any) => {
  const { ethAddress, avatar, ...newProfileData } = profileData;
  if (!ethAddress) {
    // tslint:disable-next-line:no-console
    console.error('ethereum address not address provided!');
  }
  const isLoggedIn = Box.isLoggedIn(ethAddress);
  // auth user if it's not logged in
  if (!isLoggedIn && box) {
    await box.auth(['akasha-ewa'], { address: ethAddress });
    await box.syncDone;
  }
  // update profile data
  // Keys with values are updated
  // Keys with null values are removed
  // keys with undefined values.. well.. remains undefined (not stored)
  await box.syncDone;
  try {
    const fieldsToUpdate = Object.keys(newProfileData).filter(
      (key: string) =>
        newProfileData[key] && (newProfileData[key] !== undefined || newProfileData[key] !== null),
    );
    // if we receive a key with null value we'll remove it
    // from profile store
    const fieldsToRemove = Object.keys(newProfileData)
      .filter((key: string) => newProfileData[key] === null)
      .map(keyToRm => box.public.remove(keyToRm));

    const rmSuccess = await Promise.all(fieldsToRemove);

    const values = fieldsToUpdate.map((fieldKey: string) => newProfileData[fieldKey]);
    if (avatar) {
      fieldsToUpdate.push('image');
      values.push(avatar);
    }
    const updateSuccess = await box.public.setMultiple(fieldsToUpdate, values);
    if (updateSuccess && rmSuccess) {
      // get fresh data
      await box.syncDone;
      const fetchedProfileData = await box.public.all();
      return {
        ethAddress,
        profileData: fetchedProfileData,
      };
    }
    throw new Error('Cannot update your profile data. This is a 3Box response!');
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getBoxSettings = (ethAddress: string) => {
  const localBoxSettings = localStorage.getItem(`3box.settings.${ethAddress}`);
  if (localBoxSettings) {
    return JSON.parse(localBoxSettings);
  }
  return {
    pinningNode: boxConfig.pinning_node,
    addressServer: boxConfig.address_server_url,
  };
};

export const saveBoxSettings = (payload: {
  ethAddress: string;
  pinningNode: string;
  addressServer: string;
}) => {
  const { ethAddress, pinningNode, addressServer } = payload;
  try {
    localStorage.setItem(
      `3box.settings.${ethAddress}`,
      JSON.stringify({ pinningNode, addressServer }),
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const resetBoxSettings = (ethAddress: string) => {
  try {
    localStorage.removeItem(`3box.settings.${ethAddress}`);
    return {
      pinningNode: boxConfig.pinning_node,
      addressServer: boxConfig.address_server_url,
    };
  } catch (ex) {
    throw new Error(ex.message);
  }
};
