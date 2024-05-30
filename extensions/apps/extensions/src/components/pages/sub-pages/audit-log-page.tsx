import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';
import AuditLogCard from '@akashaorg/design-system-components/lib/components/AuditLogCard';

type AuditLogPageProps = {
  appId: string;
};

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  // @TODO get audit log info from the hook when available

  const mockAuditLogData = [
    {
      author: 'CoffeeHouse',
      authorAvatar: {
        height: 320,
        width: 320,
        src: 'https://avatar.iran.liara.run/public',
      },
      changeType: t('Name Change'),
      changeNotes: t('Made a name change of “extension name” to “x”'),
      changeDate: t('16 April 2024'),
    },
    {
      author: 'CoffeeHouse',
      authorAvatar: {
        height: 320,
        width: 320,
        src: 'https://avatar.iran.liara.run/public',
      },
      changeType: t('Permission Change'),
      changeNotes: t('Made a permissions change on extension data access '),
      changeDate: t('22 February 2024'),
    },
  ];

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Audit Log')}
          />
          <Divider />
          {mockAuditLogData?.length > 0 &&
            mockAuditLogData.map((audit, idx) => (
              <>
                <AuditLogCard
                  key={idx}
                  changeAuthorProfileName={audit.author}
                  changeAuthorAvatar={audit.authorAvatar}
                  typeOfChange={audit.changeType}
                  changeNotes={audit.changeNotes}
                  dateOfChange={audit.changeDate}
                />
                {idx < mockAuditLogData.length - 1 && <Divider />}
              </>
            ))}
        </Stack>
      </Card>
    </>
  );
};
