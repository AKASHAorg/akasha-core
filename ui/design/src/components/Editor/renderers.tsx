import * as React from 'react';
import { Editor } from 'slate';
import { RenderBlockProps, RenderMarkProps } from 'slate-react';

const renderBlock = (props: RenderBlockProps, _editor: Editor, next: () => any) => {
  switch (props.node.type) {
    case 'code':
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      );
    case 'paragraph':
      return (
        <p {...props.attributes} className={props.node.data.get('className')}>
          {props.children}
        </p>
      );
    case 'quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>;
    default:
      return next();
  }
};

const renderMark = (props: RenderMarkProps, _editor: Editor, next: () => any) => {
  switch (props.mark.type) {
    case 'bold':
      return <strong>{props.children}</strong>;
    case 'code':
      return <code>{props.children}</code>;
    case 'italic':
      return <em>{props.children}</em>;
    case 'underline':
      return <u>{props.children}</u>;
    default:
      return next();
  }
};

export { renderBlock, renderMark };
