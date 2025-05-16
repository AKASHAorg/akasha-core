import React, { PropsWithChildren } from 'react';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

export enum DividerPosition {
  Top,
  Bottom,
}

export type SectionProps = {
  title: string;
  viewMoreLabel?: string;
  viewMoreIcon?: React.ReactElement; //only speficy either viewMoreLabel or viewMoreIcon, not both
  onClickviewMoreLabel?: () => void;
  titleVariant?: React.ComponentProps<typeof Typography>['variant'];
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
    return <button onClick={onClickviewMoreLabel}>{children}</button>;
  };

  const BaseCompnt = (
    <Stack spacing={6} direction="column" className="py-3">
      {showDivider && dividerPosition === DividerPosition.Top && <Separator />}
      <Stack direction="column" spacing={2}>
        <Stack justifyContent="between" direction="row">
          <Typography variant={titleVariant}>{title}</Typography>
          {!!viewMoreLabel && (
            <Button variant="link" onClick={onClickviewMoreLabel}>
              {viewMoreLabel}
            </Button>
          )}
          {!!viewMoreIcon && viewMoreIcon}
        </Stack>
        {children}
      </Stack>
      {showDivider && dividerPosition === DividerPosition.Bottom && <Separator />}
    </Stack>
  );
  if (viewMoreIcon) {
    return <ClickWrapper>{BaseCompnt}</ClickWrapper>;
  }
  return BaseCompnt;
};

export default Section;
