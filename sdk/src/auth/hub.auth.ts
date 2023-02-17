import { PrivateKey, Identity, UserAuth } from '@textile/hub';
import { authStatus } from './constants';
import { ethers } from 'ethers';
import Web3Connector from '../common/web3.connector';

/**
 *
 * @param ethAddress
 * @param secret
 * @param appName
 */
const metamaskGen = (ethAddress: string, secret: string, appName = 'ethereum.world') =>
  `
The Ethereum address used by this application is:

${ethAddress}

By signing this message, you authorize the current application to use the
following app associated with the above address:

${appName}

The hash of your private, non-persisted password or secret phrase is:

${secret}

********************************************************************************
ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS
ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION.
DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND
WRITE ACCESS TO THIS APPLICATION.
********************************************************************************
`;

/**
 *
 * @param signer - ethers Signer compatible object
 * @param sig - Signature string used as entropy for key generation
 * @returns Promise<PrivateKey>
 */
export const generatePrivateKey = async (
  signer: Web3Connector,
  sig: string,
): Promise<PrivateKey> => {
  const ethAddress = await signer.getCurrentEthAddress();
  const secret = ethers.utils.keccak256(sig);
  let message = metamaskGen(ethAddress, secret, 'ethereum.world');
  if (process.env.NODE_ENV === 'development') {
    message += '==DEV Key==';
  }
  let signedText = await signer.signMessage(message);
  if (!signedText || signedText === '0x') {
    signedText = localStorage.getItem('signedText');
  }
  const hash = ethers.utils.keccak256(signedText);
  if (hash === null || !signedText) {
    throw new Error('No account is provided. Please provide an account to this application.');
  }
  const array = hash
    .replace('0x', '')
    .match(/.{2}/g)
    .map(hexNoPrefix => ethers.BigNumber.from(`0x${hexNoPrefix}`).toNumber());

  if (array.length !== 32) {
    throw new Error('Hash of signature is not the correct size! Something went wrong!');
  }
  const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array));
  console.log('====pub key generated====', identity.public.toString());
  return identity;
};

/**
 *
 * @param identity - Identity object
 * @param signer - ethers Signer compatible object
 */
export const loginWithChallenge = (
  identity: Identity,
  signer: Web3Connector,
): (() => Promise<UserAuth>) => {
  return () => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('The login request has timed out.')),
        61000,
      );
      const socket = new WebSocket(process.env.AUTH_ENDPOINT);
      socket.onopen = () => {
        const publicKey = identity.public.toString();
        socket.send(
          JSON.stringify({
            pubkey: publicKey,
            type: 'token',
          }),
        );

        socket.onmessage = async event => {
          try {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case 'error': {
                clearTimeout(timeout);
                reject(data.value);
                break;
              }
              /** The server issued a new challenge */
              case 'challenge': {
                /** Convert the challenge json to a Buffer */
                const buf = Buffer.from(data.value);
                let addressChallenge;
                let ethAddress;
                let signUpToken;
                let acceptedTermsAndPrivacy;
                if (data.addressChallenge) {
                  addressChallenge = await signer.signMessage(data.addressChallenge);
                  ethAddress = await signer.getCurrentEthAddress();
                  authStatus.isNewUser = true;
                  signUpToken = localStorage.getItem('@signUpToken');
                  acceptedTermsAndPrivacy = localStorage.getItem('@acceptedTermsAndPrivacy');
                  if (!acceptedTermsAndPrivacy) {
                    clearTimeout(timeout);
                    return reject(
                      new Error('Terms of Service and Privacy Policy were not accepted'),
                    );
                  }
                  localStorage.removeItem('@signUpToken');
                  localStorage.removeItem('@acceptedTermsAndPrivacy');
                }
                /** User our identity to sign the challenge */
                const signed = await identity.sign(buf);
                socket.send(
                  JSON.stringify({
                    addressChallenge,
                    ethAddress,
                    signUpToken,
                    acceptedTermsAndPrivacy,
                    type: 'challenge',
                    sig: Buffer.from(signed).toJSON(),
                  }),
                );
                break;
              }
              case 'token': {
                clearTimeout(timeout);
                resolve(data.value);
                break;
              }
            }
          } catch (e) {
            clearTimeout(timeout);
            reject(e);
          }
        };
      };
    });
  };
};
