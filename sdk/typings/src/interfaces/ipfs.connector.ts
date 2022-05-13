import { LEGAL_DOCS } from './common';
import { Observable } from 'rxjs';
import { ServiceCallResult } from './responses';

interface AWF_IIpfsConnector {
  gateway: string;

  getSettings(): { gateway: string };

  catDocument(doc: string): Observable<{ data: string }>;

  /**
   *
   * @param doc - legal docs
   */
  getLegalDoc(doc: LEGAL_DOCS): ServiceCallResult<string>;

  /**
   *
   * @param ipfsHash - string
   */
  getAppDescription(ipfsHash: string): ServiceCallResult<string>;
}

export default AWF_IIpfsConnector;
