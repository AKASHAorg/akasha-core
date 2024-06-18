import React, { PropsWithChildren } from 'react';
import Divider from '../Divider';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import Button from '../Button';
import Icon from '../Icon';

export type ContentBlockProps = {
  blockTitle: string;
  viewMoreLabel?: string;
  viewMoreIcon?: React.ReactElement; //only speficy either viewMoreLabel or viewMoreIcon, not both
  onClickviewMoreLabel?: () => void;
  blockVariant?: TextProps['variant'];
  showDivider?: boolean;
};

/**
 * A ContentBlock component is a specific type of container that display content in a pre-determined
 * style. You can find examples of Content Block usage when browsing a specific app inside
 * the Extensions app in Akasha World.
 * @param blockTitle - assign a title to be displayed
 * @param viewMoreLabel - (optional) text that a user can click to view more content
 * @param viewMoreIcon - (optional) icon that a user can click to view more content. Only
 * a viewMoreLabel or viewMoreIcon should be provided at a time.
 * @param onClickviewMoreLabel - (optional) click handler for the viewMoreLabel/viewMoreIcon props
 * @param blockVariant - (optional) customize the text variant
 * @param showDivider - boolean (optional) whether to show a divider at the bottom of the block
 * @example
 * ```tsx
 *  <ContentBlock
 *    blockTitle='Version History'
 *    viewMoreIcon={<ChevronRightIcon />}
 *    showDivider={false}
 *    onClickviewMoreLabel={viewMoreClickHandler}
 *   />
 * ```
 **/
const ContentBlock: React.FC<PropsWithChildren<ContentBlockProps>> = ({
  blockTitle,
  viewMoreLabel,
  viewMoreIcon,
  onClickviewMoreLabel,
  blockVariant = 'h6',
  showDivider = true,
  children,
}) => {
  const ClickWrapper = ({ children }) => {
    return (
      <Button plain onClick={onClickviewMoreLabel}>
        {children}
      </Button>
    );
  };

  const BaseCompnt = (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between" direction="row">
          <Text variant={blockVariant}>{blockTitle}</Text>
          {!!viewMoreLabel && (
            <Button size="md" variant="text" label={viewMoreLabel} onClick={onClickviewMoreLabel} />
          )}
          {!!viewMoreIcon && (
            <Icon
              icon={viewMoreIcon}
              size="sm"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              customStyle="ml-auto"
            />
          )}
        </Stack>
        {children}
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
  if (viewMoreIcon) {
    return <ClickWrapper>{BaseCompnt}</ClickWrapper>;
  }
  return BaseCompnt;
};

export default ContentBlock;
