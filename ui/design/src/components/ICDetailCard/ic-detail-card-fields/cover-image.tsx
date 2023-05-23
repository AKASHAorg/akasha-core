import * as React from 'react';
import { Box } from 'grommet';
import ImageOverlay from '../../ImageOverlay';
import { Profile } from '@akashaorg/typings/ui';

export interface ICDetailCardCoverImageProps {
  shareLabel: string;
  background?: Profile['background'];
  handleShareClick: () => void;
}

const ICDetailCardCoverImage: React.FC<ICDetailCardCoverImageProps> = props => {
  const { shareLabel, background, handleShareClick } = props;

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
        image: `url(${background?.default?.src})`,
        repeat: 'no-repeat',
        size: 'cover',
      }}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      onClick={handleClickImage}
      data-testid="profile-card-cover-image"
    >
      {imageOverlayOpen && background?.default && (
        <ImageOverlay src={background.default?.src} closeModal={closeImageOverlay} />
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
