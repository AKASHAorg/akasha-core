import React from 'react';

import { LEGAL_DOCS } from '@akashaorg/typings/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

import PageRenderer from './page-renderer';

const CodeOfConductPage = () => {
  const legalDocReq = useLegalDoc(LEGAL_DOCS.CODE_OF_CONDUCT);

  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return <PageRenderer doc={legalDoc} error={error} />;
};

export default CodeOfConductPage;
