import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import styled from 'styled-components';

const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledMention = styled.span`
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
`;

const ImageElement = ({ attributes, children, element }: any) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <StyledImg
          src={element.url}
          loading="lazy"
          height={element.size?.naturalHeight}
          width={element.size?.naturalWidth}
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
        handleMentionClick(element.ethAddress);
        ev.stopPropagation();
      }}
    >
      {displayedMention}
      {children}
    </StyledMention>
  );
};

const TagElement = ({ attributes, children, element }: any) => {
  return (
    <StyledMention {...attributes} contentEditable={false}>
      #{element.name}
      {children}
    </StyledMention>
  );
};

const renderElement = (props: RenderElementProps, handleMentionClick?: any) => {
  switch (props.element.type) {
    case 'quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>;
    case 'image':
      return <ImageElement {...props} />;
    case 'mention':
      return <MentionElement handleMentionClick={handleMentionClick} {...props} />;
    case 'tag':
      return <TagElement {...props} />;

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

  return <span {...attributes}>{children}</span>;
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export { renderElement, renderLeaf };
