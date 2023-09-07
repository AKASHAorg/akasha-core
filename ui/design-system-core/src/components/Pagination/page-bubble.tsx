import React from 'react';

import Stack from '../Stack';
import Button from '../Button';
import Text from '../Text';

export type PageBubbleProps = {
  isActive: boolean;
  page: number;
  onClickPage: (page: number) => () => void;
};

const PageBubble: React.FC<PageBubbleProps> = props => {
  const { isActive, page, onClickPage } = props;

  const basePageWrapperStyle = 'w-8 h-8 rounded-full';

  const activePageWrapperBg = 'bg-(secondaryLight dark:secondaryDark)';

  const regularPageWrapperBg = 'bg-(grey8 dark:grey3)';
  return (
    <Button plain={true} onClick={onClickPage(page)}>
      <Stack
        align="center"
        justify="center"
        customStyle={`${basePageWrapperStyle} ${
          isActive ? activePageWrapperBg : regularPageWrapperBg
        }`}
      >
        <Text
          variant="body2"
          weight="bold"
          color={{
            light: isActive ? 'white' : 'black',
            dark: isActive ? 'black' : 'white',
          }}
        >
          {page}
        </Text>
      </Stack>
    </Button>
  );
};

export default PageBubble;
