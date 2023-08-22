import React from 'react';

import { useLegalDoc } from '@akashaorg/ui-awf-hooks';
import { LEGAL_DOCS } from '@akashaorg/typings/ui';

import PageRenderer from './page-renderer';

const TermsOfUsePage = () => {
  const legalDocReq = useLegalDoc(LEGAL_DOCS.TERMS_OF_USE);

  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return <PageRenderer doc={legalDoc} error={error} />;
};

export default TermsOfUsePage;
