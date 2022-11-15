import { Box } from 'grommet';
import * as React from 'react';
import { IProfileData } from '@akashaorg/typings/ui';
import IconButton from '../../IconButton';
import Icon from '../../Icon';
import { ShareButtonContainer } from '../styled-profile-card';
import ImageOverlay from '../../ImageOverlay';

export type IProfileCardCoverImageProps = {
  shareProfileLabel: string;
  coverImage?: IProfileData['coverImage'];
  onShareClick?: () => void;
};

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const { shareProfileLabel, coverImage, onShareClick } = props;

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);

  const handleClickImage = () => {
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  return (
    <Box
      height="9rem"
      background={{
        color: 'coverImageBackground',
        image: `url(${coverImage.url || coverImage.fallbackUrl})`,
        repeat: 'no-repeat',
        size: 'cover',
      }}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      onClick={handleClickImage}
      data-testid="profile-card-cover-image"
    >
      {imageOverlayOpen && coverImage && (
        <ImageOverlay src={coverImage} closeModal={closeImageOverlay} />
      )}
      {/* disable sharing for v.01 */}
      {false && (
        <Box align="end" pad="none">
          <ShareButtonContainer gap="xsmall" direction="row">
            <IconButton
              secondary={true}
              icon={<Icon type="reply" color="white" />}
              label={shareProfileLabel}
              onClick={onShareClick}
            />
          </ShareButtonContainer>
        </Box>
      )}
    </Box>
  );
};

export default ProfileCardCoverImage;
