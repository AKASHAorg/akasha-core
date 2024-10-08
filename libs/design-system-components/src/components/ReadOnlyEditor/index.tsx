import * as React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, withReact, Editable, RenderElementProps } from 'slate-react';
import { withMentions, withLinks } from '../Editor/plugins';
import { renderElement, renderLeaf } from '../Editor/renderers';
import { editorDefaultValue } from '../Editor/initialValue';

export interface IReadOnlyEditor {
  content: Descendant[];
  disabled?: boolean;
  handleMentionClick?: (id: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

/**
 * Component used to display content created with a slate.js based editor
 * Used in the entry card to render text content
 * @param content - slate.js formatted text content to be rendered
 * @param handleMentionClick - click handler for mentions in the content
 * @param handleTagClick - click handler for tags in the content
 * @param handleLinkClick - click handler for links in the content, will open external links in new tab
 */
const ReadOnlyEditor: React.FC<IReadOnlyEditor> = props => {
  const { content, handleMentionClick, handleTagClick, handleLinkClick } = props;

  const [value, setValue] = React.useState(content || editorDefaultValue);

  /**
   * initialise the editor with required plugins to parse content
   */
  const editor = React.useMemo(() => withLinks(withMentions(withReact(createEditor()))), []);

  React.useEffect(() => {
    editor.children = content;
    setValue(content);
  }, [editor, content]);

  return (
    <>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={() => {
          /**
           * it is a read only editor
           */
          return;
        }}
      >
        <Editable
          readOnly={true}
          renderElement={(renderProps: RenderElementProps) =>
            /**
             * pass the handlers for the various content elements in slate
             * pass null for handleDeleteImage because that is only supported when editing content
             */
            renderElement(renderProps, handleMentionClick, handleTagClick, handleLinkClick)
          }
          renderLeaf={renderLeaf}
        />
      </Slate>
    </>
  );
};

export default ReadOnlyEditor;
