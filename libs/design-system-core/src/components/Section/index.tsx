import React, { PropsWithChildren } from 'react';
import Divider from '../Divider';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import Button from '../Button';
import Icon from '../Icon';

export enum DividerPosition {
  Top,
  Bottom,
}

export type SectionProps = {
  title: string;
  viewMoreLabel?: string;
  viewMoreIcon?: React.ReactElement; //only speficy either viewMoreLabel or viewMoreIcon, not both
  onClickviewMoreLabel?: () => void;
  titleVariant?: TextProps['variant'];
  showDivider?: boolean;
  dividerPosition?: DividerPosition;
};

/**
 * A Section component is a specific type of container that display content in a pre-determined
 * style. You can find examples of Section usage when browsing a specific app inside
 * the Extensions app in Akasha World.
 * @param blockTitle - assign a title to be displayed
 * @param viewMoreLabel - (optional) text that a user can click to view more content
 * @param viewMoreIcon - (optional) icon that a user can click to view more content. Only
 * a viewMoreLabel or viewMoreIcon should be provided at a time.
 * @param onClickviewMoreLabel - (optional) click handler for the viewMoreLabel/viewMoreIcon props
 * @param titleVariant - (optional) customize the text variant
 * @param showDivider - boolean (optional) whether to show a divider at the bottom of the block
 * @param dividerPosition - the position of the divider
 * @param children - component's child nodes
 * @example
 * ```tsx
 *  <Section
 *    title='Version History'
 *    viewMoreIcon={<ChevronRightIcon />}
 *    showDivider={false}
 *    dividerPosition={DividerPosition.Top || DividerPosition.Bottom}
 *    onClickviewMoreLabel={viewMoreClickHandler}
 *   />
 * ```
 **/
const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  title,
  viewMoreLabel,
  viewMoreIcon,
  onClickviewMoreLabel,
  titleVariant = 'h6',
  showDivider = true,
  dividerPosition = DividerPosition.Bottom,
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
    <Stack direction="column" spacing="gap-y-6" padding="py-3">
      {showDivider && dividerPosition === DividerPosition.Top && <Divider />}
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between" direction="row">
          <Text variant={titleVariant}>{title}</Text>
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
      {showDivider && dividerPosition === DividerPosition.Bottom && <Divider />}
    </Stack>
  );
  if (viewMoreIcon) {
    return <ClickWrapper>{BaseCompnt}</ClickWrapper>;
  }
  return BaseCompnt;
};

export default Section;
