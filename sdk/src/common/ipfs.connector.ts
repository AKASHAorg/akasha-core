import { inject, injectable } from 'inversify';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Logging from '../logging/index';
import { TYPES } from '@akashaproject/sdk-typings';
import { LEGAL_DOCS } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { createObservableStream } from '../helpers/observable';
import AWF_IIpfsConnector from '@akashaproject/sdk-typings/lib/interfaces/ipfs.connector';

@injectable()
export default class AWF_IpfsConnector implements AWF_IIpfsConnector {
  private _log: ILogger;
  readonly gateway = 'https://hub.textile.io/ipfs';
  private readonly LEGAL_DOCS_SOURCE = {
    [LEGAL_DOCS.TERMS_OF_USE]: 'QmRCzESzs57M83JNpvk6ZpDBbSxtMpm5Pz2Th7MiRpd2ZV',
    [LEGAL_DOCS.TERMS_OF_SERVICE]: 'QmcvHEvprqZJmQa366svdWLL8dVkTRhxdcpzfGbmDL2bVE',
    [LEGAL_DOCS.PRIVACY_POLICY]: 'QmRLbfaNNhjDz4dpYhhYFxkZDABJvivyCxX5VrRQeTDQ3Q',
    [LEGAL_DOCS.CODE_OF_CONDUCT]: 'QmZGeXbYH2YPqHHCSDqtvzYpi91n1XfXgy8QY3Q377hcES',
    [LEGAL_DOCS.APP_GUIDE]: 'QmNZGKJywWYTLiyYLzSeAdCva3jHZ2grV4Yz9cw2jpMhQQ',
  };

  constructor(@inject(TYPES.Log) log: Logging) {
    this._log = log.create('AWF_IpfsConnector');
  }

  getSettings() {
    return {
      gateway: this.gateway,
    };
  }

  catDocument(doc: string) {
    return createObservableStream(fetch(`${this.gateway}/${doc}`).then(data => data.text()));
  }

  /**
   *
   * @param doc
   */
  getLegalDoc(doc: LEGAL_DOCS) {
    const selectedDoc = this.LEGAL_DOCS_SOURCE[doc];
    return this.catDocument(selectedDoc);
  }
}
