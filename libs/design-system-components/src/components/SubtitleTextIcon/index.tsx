import React from 'react';
import { IconType } from '@akashaorg/typings/lib/ui';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export type SubtitleTextIconProps = {
  icon?: React.ReactElement;
  solid?: boolean;
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  labelSize?: React.ComponentProps<typeof Typography>['variant'];
  subtitle?: string;
  subtitleIcon?: IconType;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  dataTestId?: string;
  customStyle?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
};

/**
 * The SubtitleTextIcon component serves a specific use case: to display two lines of content ( One
 * main text and a subtitle below it) and its associated icon side-by-side. It is used mainly in the
 * `Latest Topics` widget in Akasha World.
 * @param icon - (optional) supply the icon to be placed on the left side.
 * @param solid - boolean (optional) whether the icon will be applied solid style
 * @param backgroundSize - (optional) for customizing the background size of the icon
 * @param backgroundColor - boolean (optional) whether the icon will have a grey rounded background around it
 * @param label - (optional) customize the top label
 * @param labelSize - (optional) for customizing the size of the label
 * @param subtitle - (optional)  customize the bottom subtitle
 * @param gap - (optional) for customizing the gap between the elements
 * @param maxWidth - (optional) for customizing the max width of the whole component
 * @param customStyle - (optional) apply any other custom styles. Please use standard Tailwind CSS classes
 * @param onClick - (optional)click handler for when user clicks on the text
 * @param dataTestId - (optional) useful for test writing purpose
 * ```tsx
 *  <SubtitleTextIcon
      onClick={onClickHandler}
      label={'Top Label'}
      subtitle={`Bottom Subtitle`}
      icon={<HashtagIcon />}
      backgroundColor={true}
    />
 * ```
 **/
const SubtitleTextIcon: React.FC<SubtitleTextIconProps> = props => {
  const {
    icon,
    backgroundColor,
    backgroundSize,
    label,
    labelSize = 'xs',
    subtitle,
    maxWidth = '',
    dataTestId,
    customStyle = '',
    onClick,
  } = props;

  const iconBackgroundStyle = `${backgroundSize ? backgroundSize : 'w-10 h-10'} ${
    backgroundColor ? 'bg-grey8 dark:bg-grey3 rounded-full' : 'none'
  }`;

  return (
    <button onClick={onClick}>
      <Stack
        data-testid={dataTestId}
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        className={`group bg-white dark:bg-grey2 ${maxWidth} ${customStyle}`}
      >
        {icon && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className={iconBackgroundStyle}
          >
            {icon}
          </Stack>
        )}
        <Stack className="xl:max-w-[8rem] lg:max-w-[10rem] md:max-w-[6rem] xs:max-w-[2rem]">
          <Typography
            variant={labelSize}
            bold
            className="cursor-pointer group-hover:underline group-hover:decoration-black dark:group-hover:decoration-white truncate"
          >
            {label}
          </Typography>
          <Typography variant="xs" className="text-left font-medium grey7 truncate">
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </button>
  );
};

export default SubtitleTextIcon;
