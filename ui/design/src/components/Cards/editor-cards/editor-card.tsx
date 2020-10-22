import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { EditorBox } from '../../Editor/index';
import { Box, Text } from 'grommet';
import { Icon } from '../../Icon/index';
import { IEditorBox } from '../../Editor/editor-box';

export interface IEditorCard extends IEditorBox {
  className?: string;
  newPostLabel?: string;
  style?: React.CSSProperties;
  handleNavigateBack: () => void;
}

const EditorCard: React.FC<IEditorCard> = props => {
  const {
    className,
    avatar,
    ethAddress,
    postLabel,
    newPostLabel,
    placeholderLabel,
    onPublish,
    handleNavigateBack,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
  } = props;

  return (
    <MainAreaCardBox className={className} style={props.style}>
      <Box direction="row" justify="between" pad="medium" align="center" flex={false}>
        <Icon
          type="arrowLeft"
          onClick={handleNavigateBack}
          clickable={true}
          primaryColor={true}
          size="xs"
        />
        <Text size="large">{newPostLabel}</Text>
        <Icon type="akasha" clickable={true} style={{ marginLeft: '2rem' }} />
      </Box>
      <EditorBox
        avatar={avatar}
        ethAddress={ethAddress}
        onPublish={onPublish}
        postLabel={postLabel}
        withMeter={true}
        placeholderLabel={placeholderLabel}
        minHeight={'192px'}
        getMentions={getMentions}
        getTags={getTags}
        mentions={mentions}
        tags={tags}
        uploadRequest={uploadRequest}
      />
    </MainAreaCardBox>
  );
};

EditorCard.defaultProps = {
  newPostLabel: 'New Post',
};

export default EditorCard;
