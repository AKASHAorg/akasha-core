import * as React from 'react';

import { LEGAL_DOCS } from '@akashaorg/typings/lib/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

import PageRenderer from './page-renderer';

const TermsOfServicePage: React.FC<unknown> = () => {
  const legalDocReq = useLegalDoc(LEGAL_DOCS.TERMS_OF_SERVICE);

  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return <PageRenderer doc={legalDoc} error={error} />;
};

export default TermsOfServicePage;
