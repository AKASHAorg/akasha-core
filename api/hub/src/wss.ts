import route from 'koa-route';
import Emittery from 'emittery';
import { ThreadID, UserAuth, Where } from '@textile/hub';
import { utils } from 'ethers';
import { getAPISig, initAppDB, newClientDB } from './helpers';
import { contextCache } from './storage/cache';

const wss = route.all('/ws/userauth', ctx => {
  const emitter = new Emittery();
  const dbId = ThreadID.fromString(process.env.AWF_THREADdb);
  ctx.websocket.on('message', async msg => {
    try {
      const data = JSON.parse(msg);
      const db = await initAppDB();
      const client = await newClientDB();
      let currentUser: any = {};
      let addressChallenge;
      switch (data.type) {
        case 'token': {
          if (!data.pubkey) {
            throw new Error('missing pubkey');
          }
          const query = new Where('pubKey').eq(data.pubkey);
          // check if the key is already registered
          const userFound = await db.find(dbId, 'Profiles', query);
          const token = await client.getTokenChallenge(data.pubkey, (challenge: Uint8Array) => {
            if (!userFound.length) {
              addressChallenge = `Register my public key ${
                data.pubkey
              } on ${new Date().toISOString()}`;
              currentUser = {
                pubKey: data.pubkey,
                _id: '',
                creationDate: new Date().getTime(),
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
          contextCache.set(token, {
            pubKey: currentUser.pubKey,
            ethAddress: currentUser.ethAddress,
          });
          // tslint:disable-next-line:no-console
          console.log('current User', currentUser);
          if (!currentUser._id) {
            await db.create(dbId, 'Profiles', [currentUser]);
          }
          currentUser = '';
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
