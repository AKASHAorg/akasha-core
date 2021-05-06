import * as React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, withReact, Editable, RenderElementProps } from 'slate-react';
import { withMentions, withImages, withTags, withLinks } from '../Editor/plugins';
import { renderElement, renderLeaf } from '../Editor/renderers';

export interface IReadOnlyEditor {
  content: Descendant[];
  handleMentionClick?: (pubKey: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

const ReadOnlyEditor: React.FC<IReadOnlyEditor> = props => {
  const { content, handleMentionClick, handleTagClick, handleLinkClick } = props;
  const editor = React.useMemo(
    () => withLinks(withTags(withMentions(withReact(withImages(createEditor()))))),
    [],
  );
  return (
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
          renderElement(renderProps, handleMentionClick, handleTagClick, handleLinkClick)
        }
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};

export default ReadOnlyEditor;
