import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { EditorBox } from '../../Editor/index';

export interface IEditorCard {
  className?: string;
  avatar?: string;
  ethAddress?: string;
  postLabel?: string;
  placeholderLabel?: string;
  onPublish: any;
  style?: React.CSSProperties;
  handleNavigateBack: () => void;
}

const EditorCard: React.FC<IEditorCard> = props => {
  const {
    className,
    avatar,
    ethAddress,
    postLabel,
    placeholderLabel,
    onPublish,
    handleNavigateBack,
  } = props;

  return (
    <MainAreaCardBox className={className} style={props.style}>
      <EditorBox
        avatar={avatar}
        ethAddress={ethAddress}
        onPublish={onPublish}
        postLabel={postLabel}
        placeholderLabel={placeholderLabel}
        handleNavigateBack={handleNavigateBack}
      />
    </MainAreaCardBox>
  );
};

export default EditorCard;
