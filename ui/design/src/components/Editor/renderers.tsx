import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import styled from 'styled-components';
import Icon from '../Icon';
import { StyledAnchor } from '../Input/text-input-icon-form/styles';
import { StyledCloseDiv } from './styled-editor-box';

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

const ImageElement = ({ attributes, children, element, handleDeleteImage }: any) => {
  return (
    <div {...attributes}>
      <div
        role="img"
        aria-label={element.url}
        contentEditable={false}
        style={{
          minHeight: element.size?.naturalHeight,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          contain: 'layout',
        }}
      >
        {handleDeleteImage && (
          <StyledCloseDiv onClick={() => handleDeleteImage(element)}>
            <Icon type="close" clickable={true} />
          </StyledCloseDiv>
        )}
        <StyledImg
          src={element.url}
          style={{
            position: 'absolute',
          }}
        />
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
      onClick={ev => {
        handleMentionClick(element.pubKey);
        ev.stopPropagation();
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
      onClick={ev => {
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
      onClick={ev => {
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
  handleDeleteImage?: (element: any) => void,
) => {
  switch (props.element.type) {
    case 'quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>;
    case 'image':
      return <ImageElement handleDeleteImage={handleDeleteImage} {...props} />;
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
