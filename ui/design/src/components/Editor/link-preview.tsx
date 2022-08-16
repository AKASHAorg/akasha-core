import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import isUrl from 'is-url';
import Icon from '../Icon';
import { StyledCloseDiv, StyledUploadingDiv, StyledText } from './styled-editor-box';
import { IEntryData } from '@akashaorg/typings/ui';

const Favicon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const StyledCoverImg = styled.img`
  // don't resize the image to fit the width of the container
  // because the image width might be smaller than the container width
  width: fit-content;
  // align the image to the center of the container
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
`;

const StyledPicture = styled.picture`
  display: flex;
`;

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
`;

const StyledCoverBox = styled(Box)<{ showCover: boolean }>`
  display: ${props => (props.showCover ? '' : 'none')};
`;

const StyledWrapperBox = styled(Box)`
  position: relative;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
`;

function htmlDecode(input) {
  if (!input) {
    return;
  }
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

export interface ILinkPreview {
  handleLinkClick?: (url: string) => void;
  handleDeletePreview?: () => void;
  uploading?: boolean;
  linkPreviewData?: IEntryData['linkPreview'];
  uploadingLinkPreviewLabel?: string;
}

const LinkPreview: React.FC<ILinkPreview> = props => {
  const {
    handleLinkClick,
    handleDeletePreview,
    linkPreviewData,
    uploading,
    uploadingLinkPreviewLabel,
  } = props;

  const [showCover, setShowCover] = React.useState(false);
  const [faviconErr, setFaviconErr] = React.useState(false);

  const handleCoverLoad = () => {
    setShowCover(true);
  };

  const handleFaviconErr = () => {
    setFaviconErr(true);
  };

  let hostname = '';
  if (isUrl(linkPreviewData?.url)) {
    hostname = new URL(linkPreviewData?.url).hostname;
  }

  return (
    <>
      {uploading && (
        <StyledUploadingDiv>
          <Box direction="column" gap="medium" align="center" justify="center">
            <Icon type="loading" accentColor={true} />
            <StyledText size="medium" color="accentText">
              {uploadingLinkPreviewLabel}
            </StyledText>
          </Box>
        </StyledUploadingDiv>
      )}
      {!uploading && linkPreviewData && (
        <StyledWrapperBox
          onClick={(ev: Event) => {
            if (new URL(linkPreviewData.url).origin === window.location.origin) {
              handleLinkClick(linkPreviewData.url);
              ev.stopPropagation();
              ev.preventDefault();
              return false;
            } else {
              window.open(linkPreviewData?.url, '_blank', 'noopener');
            }
            return ev.stopPropagation();
          }}
        >
          {handleDeletePreview && (
            <StyledCloseDiv
              onClick={ev => {
                ev.stopPropagation();
                ev.preventDefault();
                handleDeletePreview();
              }}
            >
              <Icon type="close" clickable={true} />
            </StyledCloseDiv>
          )}
          {!!(linkPreviewData.imageSources?.url || linkPreviewData.imageSources?.fallbackUrl) && (
            <StyledCoverBox
              pad="none"
              round={{ corner: 'top', size: 'xsmall' }}
              border={[{ color: 'border', side: 'all' }]}
              showCover={showCover}
            >
              <StyledPicture>
                <source srcSet={linkPreviewData.imageSources?.fallbackUrl} />
                <StyledCoverImg
                  src={linkPreviewData.imageSources?.url}
                  onLoad={handleCoverLoad}
                  alt={linkPreviewData.imageSources?.url}
                  referrerPolicy={'no-referrer'}
                />
              </StyledPicture>
            </StyledCoverBox>
          )}

          <StyledBox
            pad="medium"
            gap="medium"
            round={
              linkPreviewData.images?.length && showCover
                ? { corner: 'bottom', size: 'xsmall' }
                : { size: 'xsmall' }
            }
            border={{
              color: 'border',
              size: 'xsmall',
              style: 'solid',
              side: 'all',
            }}
          >
            <Box direction="row" gap="small" pad={{ vertical: 'small' }} align="center">
              {!!(
                linkPreviewData.faviconSources?.url || linkPreviewData.faviconSources?.fallbackUrl
              ) && !faviconErr ? (
                <StyledPicture>
                  <source srcSet={linkPreviewData.faviconSources?.fallbackUrl} />
                  <Favicon
                    src={linkPreviewData.faviconSources?.url}
                    alt={linkPreviewData.faviconSources?.url}
                    onError={handleFaviconErr}
                    referrerPolicy={'no-referrer'}
                  />
                </StyledPicture>
              ) : (
                <Icon type="link" size="xxs" accentColor={true} />
              )}
              {!!linkPreviewData.url && (
                <Text color="accentText" truncate={true}>
                  {hostname}
                </Text>
              )}
            </Box>
            {!!linkPreviewData.title && (
              <Text size="large" weight="bold" color="primaryText">
                {linkPreviewData.title}
              </Text>
            )}
            {!!linkPreviewData.description && (
              <Text>{htmlDecode(linkPreviewData.description)}</Text>
            )}
            <Box></Box>
          </StyledBox>
        </StyledWrapperBox>
      )}
    </>
  );
};

LinkPreview.defaultProps = {
  uploadingLinkPreviewLabel: 'Loading preview',
};

export default LinkPreview;
