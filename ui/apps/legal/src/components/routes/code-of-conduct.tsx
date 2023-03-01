import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import DSNew from '@akashaorg/design-system-core';
import { LEGAL_DOCS } from '@akashaorg/typings/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

const { MdCard } = DS;

const { ErrorInfoCard, ErrorLoader } = DSNew;

const CodeOfConductPage = () => {
  const { t } = useTranslation('app-legal');

  const legalDocReq = useLegalDoc(LEGAL_DOCS.CODE_OF_CONDUCT);
  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return (
    <>
      <ErrorInfoCard error={error}>
        {message => (
          <>
            {message && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the docs')}
                details={message}
              />
            )}
            {!message && <MdCard mdText={legalDoc} />}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default CodeOfConductPage;
