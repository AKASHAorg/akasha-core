import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import styled from 'styled-components';
import Icon from '../Icon';
import { StyledAnchor } from '../TextInputIconForm/styles';
import { StyledCloseDiv } from './styled-editor-box';
import { ImageElement } from '@akashaproject/ui-awf-typings/lib/editor';

const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledMention = styled.span`
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
`;

const DisabledSpan = styled.span`
  color: ${props => props.theme.colors.secondaryText};
`;

const ImgElement = ({
  attributes,
  children,
  element,
  handleDeleteImage,
  handleClickImage,
}: any) => {
  return (
    <div
      {...attributes}
      onClick={ev => {
        if (handleClickImage && typeof handleClickImage === 'function') {
          handleClickImage(element);
        }
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      <div
        role="img"
        aria-label={element.url}
        contentEditable={false}
        style={{
          minHeight: 30,
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          contain: 'layout',
        }}
      >
        {handleDeleteImage && (
          <StyledCloseDiv
            onClick={ev => {
              if (handleDeleteImage && typeof handleClickImage === 'function') {
                handleDeleteImage(element);
              }
              ev.stopPropagation();
              ev.preventDefault();
              return false;
            }}
          >
            <Icon type="close" clickable={true} />
          </StyledCloseDiv>
        )}
        <picture>
          <StyledImg src={element.url} />
        </picture>
      </div>
      {children}
    </div>
  );
};

const MentionElement = (props: any) => {
  const { handleMentionClick, attributes, element, children } = props;
  const mention = element.userName || element.name || element.ethAddress;
  const displayedMention = mention && mention.startsWith('@') ? mention : `@${mention}`;
  return (
    <StyledMention
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleMentionClick(element.pubKey);
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      {displayedMention}
      {children}
    </StyledMention>
  );
};

const TagElement = ({ attributes, children, element, handleTagClick }: any) => {
  return (
    <StyledMention
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleTagClick(element.name);
        ev.stopPropagation();
      }}
    >
      #{element.name}
      {children}
    </StyledMention>
  );
};

const LinkElement = ({ attributes, children, element, handleLinkClick }: any) => {
  return (
    <StyledAnchor
      {...attributes}
      contentEditable={false}
      href={element.url as string}
      size="large"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(ev: Event) => {
        if (new URL(element.url).origin === window.location.origin) {
          handleLinkClick(element.url);
          ev.stopPropagation();
          ev.preventDefault();
          return false;
        }
        return ev.stopPropagation();
      }}
    >
      {element.url}
      {children}
    </StyledAnchor>
  );
};

const renderElement = (
  props: RenderElementProps,
  handleMentionClick?: (pubKey: string) => void,
  handleTagClick?: (name: string) => void,
  handleLinkClick?: (url: string) => void,
  handleDeleteImage?: ((element: ImageElement) => void) | null,
  handleClickImage?: (element: ImageElement) => void,
) => {
  switch (props.element.type) {
    case 'image':
      return (
        <ImgElement
          handleDeleteImage={handleDeleteImage}
          handleClickImage={handleClickImage}
          {...props}
        />
      );
    case 'mention':
      return <MentionElement handleMentionClick={handleMentionClick} {...props} />;
    case 'tag':
      return <TagElement handleTagClick={handleTagClick} {...props} />;
    case 'link':
      return <LinkElement handleLinkClick={handleLinkClick} {...props} />;

    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    return (
      <span {...attributes}>
        <strong>{children}</strong>
      </span>
    );
  }

  if (leaf.italic) {
    return (
      <span {...attributes}>
        <em>{children}</em>
      </span>
    );
  }

  if (leaf.underlined) {
    return (
      <span {...attributes}>
        <u>{children}</u>
      </span>
    );
  }

  if (leaf.code) {
    return (
      <span {...attributes}>
        <code>{children}</code>
      </span>
    );
  }

  if (leaf.disabled) {
    return <DisabledSpan {...attributes}>{children}</DisabledSpan>;
  }

  return <span {...attributes}>{children}</span>;
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export { renderElement, renderLeaf };
