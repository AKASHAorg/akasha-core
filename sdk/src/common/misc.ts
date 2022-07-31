import { injectable } from 'inversify';
import { PublicKey } from '@textile/hub';

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

  public publicKeyFromString(pubKey: string): PublicKey {
    return PublicKey.fromString(pubKey);
  }
}

export default AWF_Misc;
