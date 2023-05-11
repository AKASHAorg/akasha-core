import { Box } from 'grommet';
import * as React from 'react';
import IconButton from '../../IconButton';
import Icon from '../../Icon';
import { ShareButtonContainer } from '../styled-profile-card';
import ImageOverlay from '../../ImageOverlay';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type IProfileCardCoverImageProps = {
  shareProfileLabel: string;
  background?: Profile['background'];
  onShareClick?: () => void;
};

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const { shareProfileLabel, background, onShareClick } = props;

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
        image: `url(${background.default?.src})`,
        repeat: 'no-repeat',
        size: 'cover',
      }}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      onClick={handleClickImage}
      data-testid="profile-card-cover-image"
    >
      {imageOverlayOpen && background && (
        <ImageOverlay src={background.default.src} closeModal={closeImageOverlay} />
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
