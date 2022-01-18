import { LEGAL_DOCS } from './common';
import { Observable } from 'rxjs';

interface AWF_IIpfsConnector {
  gateway: string;

  getSettings(): { gateway: any };

  catDocument(doc: string): Observable<{ data: string }>;

  /**
   *
   * @param doc
   */
  getLegalDoc(doc: LEGAL_DOCS): any;
}

export default AWF_IIpfsConnector;
