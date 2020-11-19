import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';

import ContentCard from './content-card';

import { postData } from '../services/dummy-data';

const { Box } = DS;

export default function ContentList() {
  const { t } = useTranslation();

  const handleKeep = () => {
    // todo: show modal to keep content
  };

  const handleDelist = () => {
    // todo: show modal to delist content
  };
  return (
    <Box>
      {postData.map(post => (
        <ContentCard
          key={post.id}
          reportedLabel={t('Reported')}
          contentType={t(post.type)}
          forLabel={t('for')}
          additionalDescLabel={t('Additional description provided by user')}
          additionalDescContent={t(post.description)}
          reportedByLabel={t('Reported by')}
          ethAddress={t(post.ethAddress)}
          reasons={post.reasons.map(el => t(el))}
          reporterName={t(post.reporterName)}
          reporterENSName={t(post.reporterENSName)}
          reportedOnLabel={t('On')}
          dateTime={post.entryDate}
          keepContentLabel={
            post.type === 'post' ? t('Keep Post') : post.type === 'profile' ? t('Keep Profile') : ''
          }
          delistContentLabel={
            post.type === 'post'
              ? t('Delist Post')
              : post.type === 'profile'
              ? t('Delist Profile')
              : ''
          }
          handleKeep={handleKeep}
          handleDelist={handleDelist}
        />
      ))}
    </Box>
  );
}
