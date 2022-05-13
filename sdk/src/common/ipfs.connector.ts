import { inject, injectable } from 'inversify';
import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import Logging from '../logging/index';
import { TYPES } from '@akashaorg/sdk-typings';
import { LEGAL_DOCS } from '@akashaorg/sdk-typings/lib/interfaces/common';
import { createObservableStream } from '../helpers/observable';
import AWF_IIpfsConnector from '@akashaorg/sdk-typings/lib/interfaces/ipfs.connector';
import { CID } from 'multiformats/cid';
import { base16 } from 'multiformats/bases/base16';
import { multiaddrToUri } from '@multiformats/multiaddr-to-uri';
import { ServiceCallResult } from '@akashaorg/sdk-typings/lib/interfaces/responses';

@injectable()
class AWF_IpfsConnector implements AWF_IIpfsConnector {
  private _log: ILogger;
  readonly gateway = 'https://hub.textile.io/ipfs/';
  readonly originGateway = 'ipfs.hub.textile.io';
  readonly fallbackGateway = 'ipfs.infura-ipfs.io';
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

  catDocument<T>(docHash: string | CID, jsonResponse = false): ServiceCallResult<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    return createObservableStream(
      fetch(this.buildFallBackLink(docHash), { signal: controller.signal }).then(res => {
        clearTimeout(timeout);
        if (res.ok) {
          if (!jsonResponse) {
            return res.text();
          }
          return res.json();
        }
        this._log.warn(res.statusText);
        throw Error('An error occurred!');
      }),
    );
  }

  /**
   *
   * @param doc - legal docs
   */
  getLegalDoc(doc: LEGAL_DOCS) {
    const selectedDoc = this.LEGAL_DOCS_SOURCE[doc];
    return this.catDocument<never>(selectedDoc);
  }

  /**
   *
   * @param ipfsLink - string
   */
  getAppDescription(ipfsLink: string) {
    return this.catDocument<never>(ipfsLink);
  }

  validateCid(hash: string | CID) {
    if (typeof hash === 'string' && hash.startsWith('https://')) {
      return { link: hash };
    }
    const cid = typeof hash === 'string' ? CID.parse(hash) : CID.asCID(hash);
    if (!cid) {
      throw new Error(`Hash ${hash.toString()} is not a valid CID`);
    }
    return { cid };
  }

  buildOriginLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `https://${cid.toV1().toString()}.${this.originGateway}`;
  }

  buildFallBackLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `https://${cid.toV1().toString()}.${this.fallbackGateway}`;
  }

  buildPathLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `${this.gateway}${cid.toV1().toString()}`;
  }

  buildIpfsLinks(hash: string | CID) {
    const originLink = this.buildOriginLink(hash);
    const fallbackLink = this.buildFallBackLink(hash);
    const pathLink = this.buildPathLink(hash);

    return {
      originLink,
      fallbackLink,
      pathLink,
    };
  }

  transformBase16HashToV1(hash: string) {
    const cid = CID.parse(hash, base16.decoder);
    return cid.toV1();
  }

  multiAddrToUri(addrList: string[]) {
    const results = [];
    if (!addrList?.length) {
      return results;
    }
    for (const addr of addrList) {
      if (addr.substring(0, 6) === '/ipfs/') {
        results.push(this.buildOriginLink(addr.substring(6)));
      } else if (addr.substring(0, 7) === 'ipfs://') {
        results.push(this.buildOriginLink(addr.substring(7)));
      } else if (addr.substring(0, 1) === '/') {
        results.push(multiaddrToUri(addr));
      }
    }
    return results;
  }
}

export default AWF_IpfsConnector;
