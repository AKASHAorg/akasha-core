import route from 'koa-route';
import Emittery from 'emittery';
import { ThreadID, UserAuth, Where } from '@textile/hub';
import { utils, ethers } from 'ethers';
import { getAPISig, getAppDB, isValidSignature, logger, newClientDB } from './helpers';
import { contextCache } from './storage/cache';
import { Profile } from './collections/interfaces';
import { promRegistry } from './api';
import { Counter } from 'prom-client';

const wssErrorsCounter = new Counter({
  name: 'wss_requests_errored',
  help: 'The amount of wss requests that have encountered errors.',
  labelNames: ['eventName', 'errorType'],
  registers: [promRegistry],
});

const GENERAL_ERROR_METRIC = 'general error, not breaking';
const CHALLENGE_ERROR_METRIC = 'challenge event metric';
const provider = new ethers.providers.InfuraProvider(process.env.AWF_FAUCET_NETWORK, {
  projectId: process.env.AWF_FAUCET_ID,
  projectSecret: process.env.AWF_FAUCET_SECRET,
});
Emittery.isDebugEnabled = process.env.NODE_ENV !== 'production';
// const mainNetProvider = new ethers.providers.InfuraProvider('homestead', {
//   projectId: process.env.AWF_FAUCET_ID,
//   projectSecret: process.env.AWF_FAUCET_SECRET,
// });
const wallet = new ethers.Wallet(process.env.AWF_FAUCET_KEY).connect(provider);
const wss = route.all('/ws/userauth', ctx => {
  const emitter = new Emittery();
  const dbId = ThreadID.fromString(process.env.AWF_THREADdb);
  ctx.websocket.on('message', async msg => {
    try {
      const data = JSON.parse(msg);
      let currentUser: Profile = null;
      let addressChallenge;
      let exists = null;
      switch (data.type) {
        case 'token': {
          if (!data.pubkey) {
            const msg = 'missing pubkey';
            wssErrorsCounter.inc({ eventName: GENERAL_ERROR_METRIC, errorType: msg });
            throw new Error(msg);
          }
          logger.info(`wss:refreshAppDB`);
          const db = await getAppDB();
          logger.info(`wss:refreshClientDB`);
          const client = await newClientDB();
          const query = new Where('pubKey').eq(data.pubkey);
          logger.info(`wss:checkingUserFound`);
          // check if the key is already registered
          const userFound = await db.find(dbId, 'Profiles', query);
          const token = await client.getTokenChallenge(data.pubkey, (challenge: Uint8Array) => {
            if (!userFound.length) {
              addressChallenge = `Register my public key ${
                data.pubkey
              } on ${new Date().toISOString()}`;
              currentUser = {
                ethAddress: '',
                pubKey: data.pubkey,
                _id: '',
                creationDate: new Date().getTime(),
                default: [],
                providers: [],
                metaData: [],
                following: [],
                followers: [],
              };
            } else {
              currentUser = userFound[0];
            }
            return new Promise((resolve, reject) => {
              ctx.websocket.send(
                JSON.stringify({
                  addressChallenge,
                  type: 'challenge',
                  value: Buffer.from(challenge).toJSON(),
                }),
              );
              emitter.on('challenge', async (r: any) => {
                if (addressChallenge) {
                  if (!r.addressChallenge) {
                    return reject(new Error('Missing ethereum address signature challenge'));
                  }
                  if (!r.signUpToken) {
                    return reject(new Error('Missing ethereum.world invite token'));
                  }
                  if (!r.acceptedTermsAndPrivacy) {
                    return reject(
                      new Error('Terms of Service and Privacy Policy were not accepted'),
                    );
                  }
                  exists = await db.findByID(dbId, 'Invites', r.signUpToken);
                  if (!exists) {
                    return reject(new Error('The invite token is not valid.'));
                  }
                  if (exists.used) {
                    return reject(new Error('The invite token was already used.'));
                  }
                  exists.used = true;
                  exists.updateDate = new Date().getTime();
                  const arrAddressChallenge = utils.arrayify(r.addressChallenge);
                  let recoveredAddress;
                  if (arrAddressChallenge.length === 65) {
                    recoveredAddress = utils.verifyMessage(addressChallenge, arrAddressChallenge);
                    currentUser.metaData.push({
                      provider: 'ewa.user.consent',
                      property: 'acceptedTermsAndPrivacy',
                      value: r.acceptedTermsAndPrivacy,
                    });
                    Object.assign(currentUser, { ethAddress: utils.getAddress(recoveredAddress) });
                  }
                  if (
                    !r.ethAddress ||
                    !recoveredAddress ||
                    utils.getAddress(recoveredAddress) !== utils.getAddress(r.ethAddress)
                  ) {
                    const err = new Error(
                      `bad eth_sig recovery, got: ${r.ethAddress} recovered: ${recoveredAddress}`,
                    );
                    logger.error(err);

                    if (r.ethAddress) {
                      logger.info('checking for eip1271');
                      return isValidSignature(
                        addressChallenge,
                        r.addressChallenge,
                        r.ethAddress,
                        provider,
                      )
                        .then(valid => {
                          logger.info(r, { valid });
                          if (valid) {
                            Object.assign(currentUser, {
                              ethAddress: utils.getAddress(r.ethAddress),
                            });
                            return resolve(Buffer.from(r.sig));
                          }
                          //return resolve(Buffer.from('0x0'));
                          wssErrorsCounter.inc({
                            eventName: CHALLENGE_ERROR_METRIC,
                            errorType: 'invariant sig',
                          });
                          return reject(err);
                        })
                        .catch(err => {
                          wssErrorsCounter.inc({
                            eventName: CHALLENGE_ERROR_METRIC,
                            errorType: 'invariant sig final',
                          });
                          return reject(err);
                        });
                    }
                    wssErrorsCounter.inc({
                      eventName: CHALLENGE_ERROR_METRIC,
                      errorType: 'bad request',
                    });
                    //return resolve(Buffer.from('0x0'));
                    return reject(err);
                  }
                }
                resolve(Buffer.from(r.sig));
              });
              setTimeout(() => {
                //must always resolve or it will trigger UncaughtError
                //resolve(Buffer.from('0x0'));
                reject(new Error('signature checking timed out'));
                wssErrorsCounter.inc({ eventName: CHALLENGE_ERROR_METRIC, errorType: 'timeout' });
              }, 60000);
            });
          });
          const auth = await getAPISig();

          const payload: UserAuth = {
            ...auth,
            token: token,
            key: process.env.USER_GROUP_API_KEY,
          };

          ctx.websocket.send(
            JSON.stringify({
              type: 'token',
              value: payload,
            }),
          );
          contextCache.set(utils.id(token), {
            pubKey: currentUser.pubKey,
            ethAddress: currentUser.ethAddress,
          });
          if (!currentUser._id && currentUser.ethAddress) {
            logger.info('saving new user');
            await db.create(dbId, 'Profiles', [currentUser]);
            if (exists?.used) {
              logger.info('updating the invite code status');
              await db.save(dbId, 'Invites', [exists]);
            }
            await wallet.sendTransaction({
              to: currentUser.ethAddress,
              value: ethers.utils.parseEther('0.1'),
            });
          }
          currentUser = null;
          exists = null;
          addressChallenge = '';
          break;
        }
        case 'challenge': {
          if (!data.sig) {
            const msg = 'missing signature (sig)';
            wssErrorsCounter.inc({ eventName: GENERAL_ERROR_METRIC, errorType: msg });
            throw new Error(msg);
          }
          await emitter.emit('challenge', data);
          break;
        }
      }
    } catch (error) {
      logger.error('error from auth:wss: ', error);
      ctx.websocket.send(
        JSON.stringify({
          type: 'error',
          value: error.message,
        }),
      );
      wssErrorsCounter.inc({ eventName: GENERAL_ERROR_METRIC, errorType: 'all' });
    }
  });
});

export default wss;
