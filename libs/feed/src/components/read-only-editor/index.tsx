import * as React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, withReact, Editable, RenderElementProps } from 'slate-react';
import { withMentions, withLinks } from '../editor/plugins';
import { renderElement, renderLeaf } from '../editor/renderers';
import { editorDefaultValue } from '../editor/initialValue';
import { useCallback } from 'react';

export interface IReadOnlyEditor {
  content: Descendant[];
  disabled?: boolean;
  handleMentionClick?: (id: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

const noop = () => {};

/**
 * Component used to display content created with a slate.js based editor
 * Used in the entry card to render text content
 * @param props - Read only editor props
 * @param content - slate.js formatted text content to be rendered
 * @param handleMentionClick - click handler for mentions in the content
 * @param handleTagClick - click handler for tags in the content
 * @param handleLinkClick - click handler for links in the content, will open external links in new tab
 */
const ReadOnlyEditor: React.FC<IReadOnlyEditor> = props => {
  const { content, handleMentionClick, handleTagClick, handleLinkClick } = props;

  const initialContent = React.useMemo(() => content || editorDefaultValue, [content]);
  /**
   * initialise the editor with required plugins to parse content
   */
  const editor = React.useMemo(() => withLinks(withMentions(withReact(createEditor()))), []);

  const elementRenderFn = useCallback(
    (renderProps: RenderElementProps) =>
      /**
       * pass the handlers for the various content elements in slate
       * pass null for handleDeleteImage because that is only supported when editing content
       */
      renderElement(renderProps, handleMentionClick, handleTagClick, handleLinkClick),
    [handleLinkClick, handleMentionClick, handleTagClick],
  );

  return (
    <>
      <Slate editor={editor} initialValue={initialContent} onChange={noop}>
        <Editable readOnly={true} renderElement={elementRenderFn} renderLeaf={renderLeaf} />
      </Slate>
    </>
  );
};

export default ReadOnlyEditor;
