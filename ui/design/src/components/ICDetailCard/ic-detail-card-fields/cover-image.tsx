import * as React from 'react';
import { Box } from 'grommet';

import Icon from '../../Icon';
import IconButton from '../../IconButton';
import ImageOverlay from '../../ImageOverlay';
import { ShareButtonContainer } from '../../ProfileCard/styled-profile-card';

export interface ICDetailCardCoverImageProps {
  shareLabel: string;
  coverImage?: { url?: string };
  handleShareClick: () => void;
}

const ICDetailCardCoverImage: React.FC<ICDetailCardCoverImageProps> = props => {
  const { shareLabel, coverImage, handleShareClick } = props;

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
        image: `url(${coverImage})`,
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
      {/* disable share button temporary */}
      {/* <Box align="end" pad="none">
        <ShareButtonContainer gap="xsmall" direction="row">
          <IconButton
            secondary={true}
            icon={<Icon type="reply" color="white" />}
            label={shareLabel}
            onClick={handleShareClick}
          />
        </ShareButtonContainer>
      </Box> */}
    </Box>
  );
};

export default ICDetailCardCoverImage;
