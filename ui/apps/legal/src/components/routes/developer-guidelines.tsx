import React from 'react';
import { useTranslation } from 'react-i18next';

import MarkdownCard from '@akashaorg/design-system-core/lib/components/MarkdownCard';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ErrorInfoCard } from '@akashaorg/design-system-core/lib/components/ErrorLoader/error-info-card';
import { LEGAL_DOCS } from '@akashaorg/typings/ui';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';

const DeveloperGuidelinesPage = () => {
  const { t } = useTranslation('app-legal');

  const legalDocReq = useLegalDoc(LEGAL_DOCS.APP_GUIDE);
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
            {!message && <MarkdownCard mdText={legalDoc} />}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default DeveloperGuidelinesPage;
