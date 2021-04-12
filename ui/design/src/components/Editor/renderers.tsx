import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import styled from 'styled-components';
import { Icon } from '../Icon';
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

const renderElement = (
  props: RenderElementProps,
  handleMentionClick?: (pubKey: string) => void,
  handleTagClick?: (name: string) => void,
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
