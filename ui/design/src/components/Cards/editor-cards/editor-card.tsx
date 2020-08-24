import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { EditorBox, EditorMeter } from '../../Editor/index';
import { Box, Text } from 'grommet';
import { Icon } from '../../Icon/index';

export interface IEditorCard {
  className?: string;
  avatar?: string;
  ethAddress?: string;
  postLabel?: string;
  newPostLabel?: string;
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
    newPostLabel,
    placeholderLabel,
    onPublish,
    handleNavigateBack,
  } = props;

  const [letterCount, setLetterCount] = React.useState(0);

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
        <EditorMeter counter={letterCount} />
      </Box>
      <EditorBox
        avatar={avatar}
        ethAddress={ethAddress}
        onPublish={onPublish}
        postLabel={postLabel}
        placeholderLabel={placeholderLabel}
        setLetterCount={setLetterCount}
        minHeight={'192px'}
      />
    </MainAreaCardBox>
  );
};

EditorCard.defaultProps = {
  newPostLabel: 'New Post',
};

export default EditorCard;
