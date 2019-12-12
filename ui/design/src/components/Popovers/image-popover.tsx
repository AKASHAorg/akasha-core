import { Box, Tabs, Text } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon/index';
import { LinkInput } from '../Input/index';
import {
  StyledButton,
  StyledDrop,
  StyledInputDiv,
  StyledTab,
  StyledText,
} from './styled-image-popover';

export interface IImagePopover {
  target: HTMLElement;
  closePopover: () => void;
  insertImageLink: (url: string) => void;
}

const ImagePopover: React.FC<IImagePopover> = props => {
  const { target, closePopover, insertImageLink } = props;
  const [linkInputValue, setLinkInputValue] = React.useState('');

  const handleLinkInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInputValue(ev.target.value);
  };

  const handleInsertLink = () => {
    insertImageLink(linkInputValue);
  };

  const renderUploadTabTitle = () => (
    <Box direction="row" gap="xsmall" justify="center">
      <Icon type="link" />
      <Text>{'Upload image'}</Text>
    </Box>
  );

  const renderUrlTabTitle = () => (
    <Box direction="row" gap="xsmall" justify="center">
      <Icon type="link" />
      <Text>{'By url'}</Text>
    </Box>
  );
  return (
    <StyledDrop
      target={target}
      align={{ top: 'bottom' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      <Tabs>
        <StyledTab title={renderUploadTabTitle()}>
          <Box align="center" justify="center" pad={{ top: 'medium' }}>
            <StyledInputDiv>
              <StyledText size="medium" color="secondaryText">
                {'Drop an image or click to upload a file from your computer'}
              </StyledText>
            </StyledInputDiv>
          </Box>
        </StyledTab>
        <StyledTab title={renderUrlTabTitle()}>
          <Box pad={{ vertical: 'medium' }}>
            <Box pad="medium">
              <LinkInput inputValue={linkInputValue} onChange={handleLinkInputChange} />
            </Box>
            <Box align="end" pad="medium">
              <StyledButton
                label={'Insert Link'}
                onClick={handleInsertLink}
                disabled={!linkInputValue}
                primary={true}
                color="accent"
              />
            </Box>
          </Box>
        </StyledTab>
      </Tabs>
    </StyledDrop>
  );
};

export default ImagePopover;
