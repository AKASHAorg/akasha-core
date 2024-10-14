import React from 'react';
import { IconType } from '@akashaorg/typings/lib/ui';
import Stack from '../Stack';
import Icon from '../Icon';
import Text from '../Text';
import Card from '../Card';
import { getColorClasses } from '../../utils';

export type SubtitleTextIconProps = {
  icon?: React.ReactElement;
  solid?: boolean;
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  labelSize?: 'button-sm' | 'button-lg';
  subtitle?: string;
  subtitleIcon?: IconType;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  customStyle?: string;
  dataTestId?: string;
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
    customStyle = '',
    icon,
    solid,
    backgroundColor,
    backgroundSize,
    label,
    labelSize = 'button-sm',
    subtitle,
    maxWidth,
    dataTestId,
    onClick,
  } = props;

  const baseStyles = `flex items-center justify-center bg(white dark:grey2) gap-x-2`;

  const InstanceWrapperStyle = `${baseStyles} ${maxWidth} ${customStyle}`;

  const iconBackgroundStyle = `${backgroundSize ? backgroundSize : 'w-10 h-10'} ${
    backgroundColor ? 'bg(grey8 dark:grey3) rounded-full' : 'none'
  }`;

  return (
    <Card
      type="plain"
      data-testid={dataTestId}
      customStyle={InstanceWrapperStyle}
      onClick={onClick}
    >
      {icon && (
        <Stack direction="row" align="center" justify="center" customStyle={iconBackgroundStyle}>
          <Icon
            icon={icon}
            solid={solid}
            size={{ width: 'w-4', height: 'h-5' }}
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          />
        </Stack>
      )}

      <Stack customStyle="max-w(xl:[8rem] lg:[10rem] md:[6rem] xs:[2rem])">
        <Text
          variant={labelSize}
          weight="bold"
          truncate={true}
          customStyle={`cursor-pointer hover:underline ${getColorClasses(
            { light: 'black', dark: 'white' },
            'group-hover:decoration',
          )}`}
        >
          {label}
        </Text>

        <Text variant="footnotes2" color="grey7" truncate={true}>
          {subtitle}
        </Text>
      </Stack>
    </Card>
  );
};

export default SubtitleTextIcon;
