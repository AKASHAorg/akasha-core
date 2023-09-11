import React from 'react';

import { LEGAL_DOCS } from '@akashaorg/typings/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

import PageRenderer from './page-renderer';

const DeveloperGuidelinesPage: React.FC<unknown> = () => {
  const legalDocReq = useLegalDoc(LEGAL_DOCS.APP_GUIDE);

  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return <PageRenderer doc={legalDoc} error={error} />;
};

export default DeveloperGuidelinesPage;
