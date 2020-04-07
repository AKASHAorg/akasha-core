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
  consentCallback: () => void,
) => {
  try {
    const ethAddress = await getEthAddress(cache, web3Instance);
    const signer = await web3Instance.getSigner();
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
    await box.auth(['akasha-ewa'], { consentCallback, address: ethAddress });
    await box.syncDone;
    const profileData = await box.public.all();
    return {
      ethAddress,
      profileData,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const updateBoxData = async (profileData: any) => {
  const { ethAddress, avatar, ...newProfileData } = profileData;
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
      (key: string) => newProfileData[key] !== undefined || newProfileData[key] !== null,
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
      // update was successfull, return new data. don't wait for syncDone
      return {
        ethAddress,
        profileData: {
          ...newProfileData,
          image: avatar,
        },
      };
    }
    return {
      ethAddress,
      profileData: {
        ...newProfileData,
        image: avatar,
      },
      error: 'Cannot update profile data!',
    };
  } catch (err) {
    return {
      ethAddress,
      error: err,
    };
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
