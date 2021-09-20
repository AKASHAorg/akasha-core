import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import Icon from '../Icon';
import { StyledCloseDiv } from './styled-editor-box';

const Favicon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
`;

const StyledWrapperBox = styled(Box)`
  position: relative;
`;

function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

export interface ILinkPreview {
  handleLinkClick?: (url: string) => void;
  handleDeletePreview?: () => void;
  linkPreviewData: any;
}

const LinkPreview: React.FC<ILinkPreview> = props => {
  const { handleLinkClick, handleDeletePreview, linkPreviewData } = props;
  return (
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
      {linkPreviewData.images.length > 0 && (
        <Box
          background={{
            color: '#DDD',
            image: `url(${linkPreviewData.images[0]})`,
            repeat: 'no-repeat',
            size: 'cover',
          }}
          height="18rem"
          pad="none"
          round={{ corner: 'top', size: 'xsmall' }}
        />
      )}

      <StyledBox
        pad="medium"
        gap="medium"
        round={
          linkPreviewData.images.length > 0
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
          {linkPreviewData.favicons?.length ? (
            <Favicon src={linkPreviewData.favicons[0]} />
          ) : (
            <Icon type="link" size="xxs" accentColor={true} />
          )}
          <Text color="accentText" truncate={true}>
            {linkPreviewData.url}
          </Text>
        </Box>
        <Text size="large" weight="bold" color="primaryText">
          {linkPreviewData.title}
        </Text>
        <Text>{htmlDecode(linkPreviewData.description)}</Text>
        <Box></Box>
      </StyledBox>
    </StyledWrapperBox>
  );
};

export default LinkPreview;
