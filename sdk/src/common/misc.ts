import { inject, injectable } from 'inversify';
import { validate } from './validator';
import { z } from 'zod';
import { AccountId } from 'caip';
import { Resolver } from 'did-resolver';
import { getResolver } from 'pkh-did-resolver';
import KeyResolver from 'key-did-resolver';
import { isAddress } from 'ethers';
import { TYPES } from '@akashaorg/typings/lib/sdk';
import AWF_Config from './config';

@injectable()
class AWF_Misc {
  private endPoint: string;
  private resolver: Resolver | undefined;
  static readonly statsPath = '?query=%7BserviceStatus%7D';
  private _config: AWF_Config;

  constructor(@inject(TYPES.Config) config: AWF_Config) {
    this._config = config;
    const url = new URL(AWF_Misc.statsPath, this._config.getOption('graphql_uri'));
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
    return fetch(this.endPoint, {
      method: 'GET',
      headers: { 'apollo-require-preflight': 'true' },
    }).then(response => {
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
    const id = info?.didDocument?.id;
    if (id) {
      const segments = id.split(':');
      if (segments.includes('eip155')) {
        const address = segments.at(-1);
        if (address)
          return Object.assign({}, info.didDocument, { isEthAddress: isAddress(address) });
      }
    }
    return info?.didDocument;
  }
}

export default AWF_Misc;
