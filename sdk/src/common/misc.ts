import { injectable } from 'inversify';
import { PrivateKey, PublicKey } from '@textile/hub';
import { validate } from './validator';
import { PubKey, PubKeySchema } from '@akashaorg/typings/sdk';

@injectable()
class AWF_Misc {
  private endPoint: string;
  static readonly statsPath = '/api/service-status';
  constructor() {
    const url = new URL(AWF_Misc.statsPath, process.env.GRAPHQL_URI);
    this.endPoint = url.href;
  }

  public async getApiStatus() {
    return fetch(this.endPoint, { method: 'GET' }).then(response => {
      return { statusCode: response.status, success: response.ok };
    });
  }

  @validate(PubKeySchema)
  public publicKeyFromString(pubKey: PubKey): PublicKey {
    return PublicKey.fromString(pubKey);
  }

  // for testing purposes only
  public async generateEncryptedMsgFor(pubKey: string) {
    const toPubKey = this.publicKeyFromString(pubKey);

    const randomPrivKey = PrivateKey.fromRandom();
    const body: {
      sub: string;
      aud: string;
      iat: string;
      sig: string;
    } = {
      sub: randomPrivKey.public.toString(),
      aud: pubKey,
      iat: new Date().toISOString(),
      sig: '',
    };
    const sigMsg = new TextEncoder().encode(
      JSON.stringify({ sub: body.sub, aud: body.aud, iat: body.iat }),
    );
    const sig = await randomPrivKey.sign(sigMsg);
    body.sig = Buffer.from(sig).toString('base64');

    const resultMsg = new TextEncoder().encode(JSON.stringify(body));
    const encryptedMsg = await toPubKey.encrypt(resultMsg);
    return Buffer.from(encryptedMsg).toString('base64');
  }
}

export default AWF_Misc;
