import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import PageLayout from './base-layout';
import { ILegalItem, legalItems } from '../../utils/legal-items';
import { useNavigate } from '@tanstack/react-router';

const MainPage: React.FC = () => {
  const { t } = useTranslation('app-legal');
  const navigate = useNavigate();
  const handleLegalOptionClick = (option: string) => () => {
    navigate({ to: option });
  };

  return (
    <PageLayout title={t('AKASHA Legal')}>
      <Stack padding="px-4">
        {legalItems.map((item: ILegalItem, idx: number) => {
          const baseStyle = `flex py-4 justify-between items-center ${
            idx !== legalItems.length - 1 ? 'border(b-1 solid grey8 dark:grey5)' : 'border-none'
          }`;

          const children = (
            <>
              <Text>{`${t('{{itemLabel}}', { itemLabel: item.label as string })}`}</Text>
              {<Icon icon={<ChevronRightIcon />} accentColor={true} />}
            </>
          );

          return (
            <React.Fragment key={`${idx}${item.label}`}>
              <Button
                plain={true}
                customStyle={`w-full ${baseStyle}`}
                onClick={handleLegalOptionClick(item.route)}
              >
                {children}
              </Button>
            </React.Fragment>
          );
        })}
      </Stack>
    </PageLayout>
  );
};

export default MainPage;
