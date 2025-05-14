import React, { useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Separator } from '@akashaorg/ui/lib/components/separator';

import Stack from '../Stack';
import Card from '../Card';

export type AccordionProps = {
  customStyle?: string;
  contentStyle?: string;
  accordionId: string;
  open: boolean;
  headerDivider?: boolean;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
  handleClick: (id: string) => void;
};

/**
 * An accordion provides a fast and easy way to create expandable and collapsible sections
 * anywhere in your app. Its container and content can be easily customized using the
 * `customStyle` and `contentStyle` props.
 * #### Usage
 * @example
 * ```tsx
 * const title = (
 * <Stack align="center" direction="row">
 *  <Avatar
 *   profileId={profileId}
 *   avatar={{ src: 'https://placebeard.it/360x360', height: 360, width: 360 }}
 *   />
 *   <Text customStyle="ml-2.5">Item name</Text>
 * </Stack>
 * );
 *
 * const content = (
 * <Stack>
 *   <Text>some interesting items</Text>
 *   <Text>could be placed</Text>
 *   <Text>inside the accordion</Text>
 * </Stack>
 * );
 * <Accordion open={true} accordionId='someId' titleNode={title} contentNode={content} customStyle='w-[15%]' />
 * ```
 **/
const Accordion: React.FC<AccordionProps> = props => {
  const {
    customStyle = '',
    contentStyle = '',
    accordionId,
    open,
    headerDivider,
    titleNode,
    contentNode,
    handleClick,
  } = props;

  const handleToggle = () => handleClick(accordionId);

  const style = 'h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  const headerUi = useMemo(
    () => (
      <Stack direction="row" align="center" justify="between" customStyle={customStyle}>
        {titleNode}
        {open ? <ChevronUpIcon className={style} /> : <ChevronDownIcon className={style} />}
      </Stack>
    ),
    [customStyle, open, titleNode],
  );

  return (
    <>
      <Card type="plain" onClick={handleToggle} customStyle="w-full cursor-pointer">
        {headerDivider ? (
          <Stack direction="column" spacing="gap-y-4">
            {headerUi}
            <Separator />
          </Stack>
        ) : (
          headerUi
        )}
      </Card>

      {open && <Stack customStyle={`${contentStyle}`}>{contentNode}</Stack>}
    </>
  );
};

export default Accordion;
