import React from 'react';

import { IconType } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import IconDrop, { IconEntry } from './icon-drop';

import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';

export type EditorToolbarProps = {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeThroughClick: () => void;
};

const EditorToolbar: React.FC<EditorToolbarProps> = props => {
  const { onBoldClick, onItalicClick, onUnderlineClick, onStrikeThroughClick } = props;

  const caseStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });
  const listStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });
  const alignStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });

  const caseIcons: IconEntry[] = [
    { type: 'textcaseSentence', handler: () => handleIconClick('textcaseSentence') },
    { type: 'textcaseLower', handler: () => handleIconClick('textcaseLower') },
    { type: 'textcaseUpper', handler: () => handleIconClick('textcaseUpper') },
  ];

  const listIcons: IconEntry[] = [
    { type: 'listBulleted', handler: () => handleIconClick('listBulleted') },
    { type: 'listNumbered', handler: () => handleIconClick('listNumbered') },
  ];

  const alignIcons: IconEntry[] = [
    { type: 'alignLeft', handler: () => handleIconClick('alignLeft') },
    { type: 'alignRight', handler: () => handleIconClick('alignRight') },
    { type: 'alignCenter', handler: () => handleIconClick('alignCenter') },
    { type: 'alignJustify', handler: () => handleIconClick('alignJustify') },
  ];

  const [dropOpen, setDropOpen] = React.useState<string | null>(null);
  const [caseStyle, setCaseStyle] = React.useState<string>('textcaseSentence');
  const [listStyle, setListStyle] = React.useState<string>('listBulleted');
  const [alignStyle, setAlignStyle] = React.useState<string>('alignLeft');

  const handleIconClick = (iconType: string) => {
    switch (dropOpen) {
      case 'align':
        setAlignStyle(iconType);
        setDropOpen(null);
        break;
      case 'list':
        setListStyle(iconType);
        setDropOpen(null);
        break;
      case 'case':
        setCaseStyle(iconType);
        setDropOpen(null);
        break;
      default:
        setDropOpen(null);
        break;
    }
  };
  return (
    <Box customStyle="flex flex-row justify-center p-2 gap-2">
      {/* emoji */}

      {/* uncomment this code to enable color-picker. You must install react-color, or react-colorful -
      a light weight alternative (recommended) */}

      <Stack customStyle="relative">
        <Box
          customStyle="flex flex-row items-center"
          onClick={() => setDropOpen('case')}
          ref={caseStyleRef}
        >
          <Icon type={caseStyle as IconType} size="sm" />
          <Icon type="ChevronDownIcon" />
        </Box>

        {caseStyleRef.current && dropOpen === 'case' && <IconDrop dropItems={caseIcons} />}
      </Stack>
      <button onClick={onBoldClick}>
        <Icon type="boldAlt" />
      </button>
      <button onClick={onItalicClick}>
        <Icon type="italic" />
      </button>
      <button onClick={onUnderlineClick}>
        <Icon type="underline" />
      </button>
      <button onClick={onStrikeThroughClick}>
        <Icon type="strikethrough" />
      </button>

      <Stack customStyle="relative">
        <button onClick={() => setDropOpen('list')}>
          <Box customStyle="flex flex-row items-center" ref={listStyleRef}>
            <Icon type={listStyle as IconType} size="sm" />
            <Icon type="ChevronDownIcon" />
          </Box>
        </button>
        {listStyleRef.current && dropOpen === 'list' && <IconDrop dropItems={listIcons} />}
      </Stack>

      <Stack customStyle="flex flex-row">
        <button onClick={() => setDropOpen('align')}>
          <Box customStyle="flex flex-row items-center" ref={alignStyleRef}>
            <Icon type={alignStyle as IconType} size="sm" />
            <Icon type="ChevronDownIcon" />
          </Box>
        </button>
        {alignStyleRef.current && dropOpen === 'align' && <IconDrop dropItems={alignIcons} />}
      </Stack>
    </Box>
  );
};

export default EditorToolbar;
