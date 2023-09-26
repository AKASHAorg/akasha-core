import React from 'react';

import { LEGAL_DOCS } from '@akashaorg/typings/lib/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

import PageRenderer from './page-renderer';

const PrivacyPolicyPage: React.FC<unknown> = () => {
  const legalDocReq = useLegalDoc(LEGAL_DOCS.PRIVACY_POLICY);

  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return <PageRenderer doc={legalDoc} error={error} />;
};

export default PrivacyPolicyPage;
