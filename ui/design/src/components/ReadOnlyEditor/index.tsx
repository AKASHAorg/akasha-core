import * as React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, withReact, Editable, RenderElementProps } from 'slate-react';
import { withMentions, withImages, withTags, withLinks } from '../Editor/plugins';
import { renderElement, renderLeaf } from '../Editor/renderers';
import { ModalContainer } from '../LoginModal/fullscreen-modal-container';
import { Portal } from '../Editor/helpers';
import Icon from '../Icon';
import styled from 'styled-components';
import { StyledCloseDiv } from '../Editor/styled-editor-box';
import { ImageElement } from '../Editor/custom-types';

export interface IReadOnlyEditor {
  content: Descendant[];
  handleMentionClick?: (pubKey: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

const StyledOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.darkGrey};
`;

const ReadOnlyEditor: React.FC<IReadOnlyEditor> = props => {
  const { content, handleMentionClick, handleTagClick, handleLinkClick } = props;

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  const editor = React.useMemo(
    () => withLinks(withTags(withMentions(withReact(withImages(createEditor()))))),
    [],
  );

  const renderImageOverlay = () => (
    <Portal>
      <ModalContainer
        animation={{
          type: 'fadeIn',
          duration: 250,
          delay: 0,
        }}
      >
        <StyledOverlay
          onClick={(ev: React.SyntheticEvent) => {
            ev.stopPropagation();
          }}
        >
          <StyledCloseDiv onClick={closeImageOverlay}>
            <Icon type="close" clickable={true} />
          </StyledCloseDiv>
          {imgUrl && (
            <picture>
              <img src={imgUrl} />
            </picture>
          )}
        </StyledOverlay>
      </ModalContainer>
    </Portal>
  );

  const handleClickImage = (element: ImageElement) => {
    setImgUrl(element.url);
    setImageOverlayOpen(true);
  };

  return (
    <>
      <Slate
        editor={editor}
        value={content}
        onChange={() => {
          return;
        }}
      >
        <Editable
          readOnly={true}
          renderElement={(renderProps: RenderElementProps) =>
            renderElement(
              renderProps,
              handleMentionClick,
              handleTagClick,
              handleLinkClick,
              null,
              handleClickImage,
            )
          }
          renderLeaf={renderLeaf}
        />
      </Slate>
      {imageOverlayOpen && renderImageOverlay()}
    </>
  );
};

export default ReadOnlyEditor;
