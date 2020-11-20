import route from 'koa-route';
import Emittery from 'emittery';
import { ThreadID, UserAuth, Where } from '@textile/hub';
import { utils } from 'ethers';
import { getAPISig, getAppDB, newClientDB } from './helpers';
import { contextCache } from './storage/cache';
import { Profile } from './collections/interfaces';

const wss = route.all('/ws/userauth', ctx => {
  const emitter = new Emittery();
  const dbId = ThreadID.fromString(process.env.AWF_THREADdb);
  ctx.websocket.on('message', async msg => {
    try {
      const data = JSON.parse(msg);
      let currentUser: Profile = null;
      let addressChallenge;
      switch (data.type) {
        case 'token': {
          if (!data.pubkey) {
            throw new Error('missing pubkey');
          }
          const db = await getAppDB();
          const client = await newClientDB();
          const query = new Where('pubKey').eq(data.pubkey);
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
              emitter.on('challenge', (r: any) => {
                if (addressChallenge) {
                  if (!r.addressChallenge) {
                    throw new Error('missing ethereum address signature challenge');
                  }
                  const recoveredAddress = utils.verifyMessage(
                    addressChallenge,
                    r.addressChallenge,
                  );
                  Object.assign(currentUser, { ethAddress: recoveredAddress });
                }
                resolve(Buffer.from(r.sig));
              });
              setTimeout(() => {
                reject();
              }, 15000);
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
          if (!currentUser._id) {
            await db.create(dbId, 'Profiles', [currentUser]);
          }
          currentUser = null;
          addressChallenge = '';
          break;
        }
        case 'challenge': {
          if (!data.sig) {
            throw new Error('missing signature (sig)');
          }
          await emitter.emit('challenge', data);
          break;
        }
      }
    } catch (error) {
      ctx.websocket.send(
        JSON.stringify({
          type: 'error',
          value: error.message,
        }),
      );
    }
  });
});

export default wss;
