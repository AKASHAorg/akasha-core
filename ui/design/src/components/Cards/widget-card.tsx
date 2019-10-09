import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Box } from 'grommet';
import { IconType } from '../Icon/index';
import TextIcon from '../TextIcon/index';
import List, { renderItem } from '../List/index';

export interface ICardWidgetProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  title: string;
  titleColor?: string;
  iconType: IconType;
  dataSource: string[];
}

const WidgetCard: React.FC<ICardWidgetProps> = props => {
  const { onClick, margin, iconType, title, titleColor, dataSource } = props;

  return (
    <Box
      direction="column"
      elevation="styleGuideShadow"
      fill
      pad="16px"
      gap="16px"
      round="8px"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'all',
      }}
    >
      <TextIcon
        iconType={iconType}
        text={title}
        onClick={onClick}
        margin={margin}
        color={titleColor}
      />
      <List dataSource={dataSource} renderItem={(text: string) => renderItem({ text })} />
    </Box>
  );
};

const defaultProps = {
  title: 'Widget Card',
  iconType: 'home' as IconType,
  dataSource: ['widget', 'card'],
};

WidgetCard.defaultProps = defaultProps;

export default WidgetCard;
