import * as React from 'react';
import { RenderElementProps, RenderMarkProps } from 'slate-react';
import styled from 'styled-components';

const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  max-height: 20em;
`;

const renderMark = (props: RenderMarkProps) => {
  switch (props.mark.type) {
    case 'bold':
      return <strong {...props.attributes}>{props.children}</strong>;
    case 'code':
      return <code {...props.attributes}>{props.children}</code>;
    case 'italic':
      return <em {...props.attributes}>{props.children}</em>;
    case 'underline':
      return <u {...props.attributes}>{props.children}</u>;
    default:
      return <div {...props.attributes}>{props.children}</div>;
  }
};

const ImageElement = ({ attributes, children, element }: any) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <StyledImg src={element.url} />
      </div>
      {children}
    </div>
  );
};

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'code':
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      );
    case 'quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>;
    case 'image':
      return <ImageElement {...props} />;

    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
};

export { renderMark, renderElement };
