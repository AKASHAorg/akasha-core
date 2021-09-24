import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import isUrl from 'is-url';
import Icon from '../Icon';
import { StyledCloseDiv, StyledUploadingDiv, StyledText } from './styled-editor-box';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { isMobileOnly } from 'react-device-detect';

const Favicon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const StyledCoverImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
`;

const StyledCoverBox = styled(Box)<{ showCover: boolean }>`
  display: ${props => (props.showCover ? '' : 'none')};
`;

const StyledWrapperBox = styled(Box)`
  position: relative;
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
            <Icon type="loading" />
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
              window.open(linkPreviewData.url, '_blank', 'noopener');
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
          {!!linkPreviewData.images?.length && (
            <StyledCoverBox
              height={isMobileOnly ? '9.5rem' : '18rem'}
              pad="none"
              round={{ corner: 'top', size: 'xsmall' }}
              border={[{ color: 'border', side: 'all' }]}
              showCover={showCover}
            >
              <StyledCoverImg
                src={linkPreviewData.images[0]}
                onLoad={handleCoverLoad}
                alt={linkPreviewData.images[0]}
                referrerPolicy={'no-referrer'}
              />
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
              {linkPreviewData.favicons?.length && !faviconErr ? (
                <Favicon
                  src={linkPreviewData.favicons[0]}
                  alt={linkPreviewData.favicons[0]}
                  onError={handleFaviconErr}
                  referrerPolicy={'no-referrer'}
                />
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
