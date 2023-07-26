import { injectable } from 'inversify';
import { validate } from './validator';
import { z } from 'zod';
import { AccountId } from 'caip';
import { Resolver } from 'did-resolver';
import { getResolver } from 'pkh-did-resolver';
import KeyResolver from 'key-did-resolver';

@injectable()
class AWF_Misc {
  private endPoint: string;
  private resolver: Resolver | undefined;
  static readonly statsPath = '/api/service-status';

  constructor() {
    const url = new URL(AWF_Misc.statsPath, process.env.GRAPHQL_URI);
    this.endPoint = url.href;
  }

  private _setupDidResolver() {
    const pkhResolver = getResolver();
    const keyDidResolver = KeyResolver.getResolver();
    this.resolver = new Resolver(
      {
        ...pkhResolver,
        ...keyDidResolver,
      },
      {
        cache: true,
      },
    );
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

  @validate(z.string())
  public async resolveDID(serialisedID: string) {
    if (!this.resolver) {
      this._setupDidResolver();
    }
    const info = await this.resolver?.resolve(serialisedID);
    return info?.didDocument;
  }
}

export default AWF_Misc;
