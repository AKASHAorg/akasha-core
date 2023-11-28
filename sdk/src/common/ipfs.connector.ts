import { inject, injectable } from 'inversify';
import { LEGAL_DOCS, LegalDocsSchema, TYPES } from '@akashaorg/typings/lib/sdk';
import Logging from '../logging/index';
import { CID } from 'multiformats/cid';
import { base16 } from 'multiformats/bases/base16';
import { multiaddrToUri } from '@multiformats/multiaddr-to-uri';
import { Client, create } from '@web3-storage/w3up-client';
import * as Signer from '@ucanto/principal/ed25519';
import pino from 'pino';
import { z } from 'zod';
import { validate } from './validator';

@injectable()
class AWF_IpfsConnector {
  private _log: pino.Logger;
  readonly gateway = 'https://cloudflare-ipfs.com/ipfs/';
  readonly originGateway = 'ipfs.w3s.link';
  readonly fallbackGateway = 'ipfs.cf-ipfs.com';
  private readonly LEGAL_DOCS_SOURCE = {
    [LEGAL_DOCS.TERMS_OF_USE]: 'bafkreie3pa22hfttuuier6rp6sm7nngfc5jgfjzre7wc5a2ww7z375fhwm',
    [LEGAL_DOCS.TERMS_OF_SERVICE]: 'bafkreib5jg73c6bmbzkrokpusraiwwycnkypol3xh3uadsu7hhzefp6g2e',
    [LEGAL_DOCS.PRIVACY_POLICY]: 'bafkreifjtbzuxwhhmmpq7c3xn74wbzog3robhsjyauvwtshh6zst2axlhm',
    [LEGAL_DOCS.CODE_OF_CONDUCT]: 'bafkreie6ygpcmpckoxnb6rip62nxztntwu5k2oqmwfvxyubfppwimhype4',
    [LEGAL_DOCS.APP_GUIDE]: 'bafkreidpkbwzpxupnnty4bua5w4n7ddiyugb2ermb2htkxczrw7okan3nu',
  };
  #w3upClient!: Client;

  constructor(@inject(TYPES.Log) log: Logging) {
    this._log = log.create('AWF_IpfsConnector');
    create().then(c => {
      this.#w3upClient = c;
    });
  }

  getSettings() {
    return {
      gateway: this.gateway,
    };
  }

  // email is just temporary until delegation works
  @validate(z.instanceof(Blob), z.string().optional())
  async uploadFile(file: Blob, email?: `${string}@${string}`) {
    const spaces = this.#w3upClient.spaces();
    if (!spaces.length) {
      const newSpace = await this.#w3upClient.createSpace(`akasha-uploads.${new Date().getTime()}`);
      await this.#w3upClient.setCurrentSpace(newSpace.did());
    }

    // if (!this.#w3upClient.spaces()[0].registered()) {
    //   if (!email) {
    //     throw new Error('Must specify an email address');
    //   }
    //
    //   this._log.info(`Sending email to ${email}`);
    //   await this.#w3upClient.authorize(email);
    //   this._log.info(`registering space for ${email}`);
    //   await this.#w3upClient.registerSpace(email);
    // }
    //claim existing spaces
    await this.#w3upClient.capability.access.claim();

    this._log.info('uploading file');
    return this.#w3upClient.uploadFile(file);
  }

  @validate(z.union([z.string(), z.instanceof(CID)]), z.boolean().optional())
  async catDocument<T>(docHash: string | CID, jsonResponse = false): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    return fetch(this.buildFallBackLink(docHash), { signal: controller.signal }).then(res => {
      clearTimeout(timeout);
      if (res.ok) {
        if (!jsonResponse) {
          return res.text();
        }
        return res.json();
      }
      this._log.warn(res.statusText);
      throw Error('An error occurred!');
    });
  }

  /**
   *
   * @param doc - legal docs
   */
  @validate(LegalDocsSchema)
  async getLegalDoc(doc: LEGAL_DOCS) {
    const selectedDoc = this.LEGAL_DOCS_SOURCE[doc];
    return this.catDocument<never>(selectedDoc);
  }

  @validate(z.union([z.string(), z.instanceof(CID)]))
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

  @validate(z.union([z.string(), z.instanceof(CID)]))
  buildOriginLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `https://${cid?.toV1().toString()}.${this.originGateway}`;
  }

  @validate(z.union([z.string(), z.instanceof(CID)]))
  buildFallBackLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `https://${cid?.toV1().toString()}.${this.fallbackGateway}`;
  }

  @validate(z.union([z.string(), z.instanceof(CID)]))
  buildPathLink(hash: string | CID) {
    const { link, cid } = this.validateCid(hash);
    if (link) {
      return link;
    }
    return `${this.gateway}${cid?.toV1().toString()}`;
  }

  @validate(z.union([z.string(), z.instanceof(CID)]))
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

  @validate(z.string())
  transformBase16HashToV1(hash: string) {
    const cid = CID.parse(hash, base16.decoder);
    return cid.toV1();
  }

  @validate(z.array(z.string()))
  multiAddrToUri(addrList: string[]) {
    const results: string[] = [];
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
