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
    [LEGAL_DOCS.TERMS_OF_USE]: 'bafkreie3pa22hfttuuier6rp6sm7nngfc5jgfjzre7wc5a2ww7z375fhwm',
    [LEGAL_DOCS.TERMS_OF_SERVICE]: 'bafkreib5jg73c6bmbzkrokpusraiwwycnkypol3xh3uadsu7hhzefp6g2e',
    [LEGAL_DOCS.PRIVACY_POLICY]: 'bafkreifjtbzuxwhhmmpq7c3xn74wbzog3robhsjyauvwtshh6zst2axlhm',
    [LEGAL_DOCS.CODE_OF_CONDUCT]: 'bafkreie6ygpcmpckoxnb6rip62nxztntwu5k2oqmwfvxyubfppwimhype4',
    [LEGAL_DOCS.APP_GUIDE]: 'bafkreidpkbwzpxupnnty4bua5w4n7ddiyugb2ermb2htkxczrw7okan3nu',
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
    return createObservableStream(
      fetch(`${this.gateway}/${doc}`).then(res => {
        if (res.ok) return res.text();
        throw Error('An error occurred!');
      }),
    );
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
