import { injectable } from 'inversify';
import { validate } from './validator';
import { z } from 'zod';
import { AccountId } from 'caip';

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

  @validate(z.string(), z.boolean().optional())
  public getAccountInfoFromID(serialisedID: string, isDID = true) {
    // parses strings like did:pkh:eip155:5:0xethereumaddress
    return AccountId.parse(isDID ? serialisedID.split(':').slice(2).join(':') : serialisedID);
  }
}

export default AWF_Misc;
