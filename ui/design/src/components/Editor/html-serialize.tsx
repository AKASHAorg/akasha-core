import React from 'react';
import Html from 'slate-html-serializer';

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
};

const rules = [
  {
    deserialize(el: Element, next: (el: NodeListOf<ChildNode>) => void) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        };
      }
      return;
    },
    serialize(obj: any, children: React.ReactChildren) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>;
          case 'quote':
            return <blockquote>{children}</blockquote>;
        }
      }
      return;
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el: Element, next: (el: NodeListOf<ChildNode>) => void) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        };
      }
      return;
    },
    serialize(obj: any, children: React.ReactChildren) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          case 'underline':
            return <u>{children}</u>;
        }
      }
      return;
    },
  },
];

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });

export { html };
