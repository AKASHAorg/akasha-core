import * as React from 'react';
import { createEditor } from 'slate';
import { Slate, withReact, Editable } from 'slate-react';
import { withMentions, withImages, withTags } from './plugins';
import { renderElement, renderLeaf } from './renderers';

export interface IReadOnlyEditor {
  content: any;
}

const ReadOnlyEditor: React.FC<IReadOnlyEditor> = props => {
  const editor = React.useMemo(
    () => withTags(withMentions(withReact(withImages(createEditor())))),
    [],
  );
  return (
    <Slate
      editor={editor}
      value={props.content}
      onChange={() => {
        return;
      }}
    >
      <Editable readOnly={true} renderElement={renderElement} renderLeaf={renderLeaf} />
    </Slate>
  );
};

export { ReadOnlyEditor };
