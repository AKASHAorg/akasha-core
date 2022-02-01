import * as React from 'react';
import { Box, Text } from 'grommet';

import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';
import ICDetailCardName from './ic-detail-card-fields/name';

export interface ICDetailCardProps {
  className?: string;

  // labels
  titleLabel: string;
  shareLabel: string;
  descriptionLabel: string;

  hash?: string;
  avatar?: string;
  coverImage?: string;
  ethAddress?: string;

  handleShareClick: () => void;
}

const ICDetailCard: React.FC<ICDetailCardProps> = props => {
  const {
    className,
    titleLabel,
    shareLabel,
    descriptionLabel,
    hash,
    avatar,
    coverImage,
    ethAddress,
    handleShareClick,
  } = props;
  return (
    <MainAreaCardBox className={className}>
      <ICDetailCardCoverImage
        shareLabel={shareLabel}
        coverImage={coverImage}
        handleShareClick={handleShareClick}
      />
      <Box direction="column" pad={{ bottom: 'medium' }} margin={{ horizontal: 'medium' }}>
        <Box height="70px" direction="row" justify="between">
          <Box direction="row">
            <ICDetailCardAvatar ethAddress={ethAddress} avatar={avatar} />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <ICDetailCardName name={titleLabel} />
              <Box direction="row" gap="xsmall">
                <Text size="medium" color="secondaryText">
                  {hash ? `@${hash.replace('@', '')}` : null}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box border={{ color: 'accent', size: 'xsmall', style: 'solid', side: 'all' }}>
          <Text>{descriptionLabel}</Text>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

ICDetailCard.defaultProps = {
  titleLabel: 'Integration App Name',
  shareLabel: 'Share',
  descriptionLabel: 'Description',
};

export default ICDetailCard;
