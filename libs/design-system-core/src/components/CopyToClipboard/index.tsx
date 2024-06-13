import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import Button from '../Button';
import Tooltip from '../Tooltip';

export type CopyToClipboardProps = PropsWithChildren<{
  value: string;
  copyText?: string;
  copiedText?: string;
}>;

/**
 * A CopyToClipboard component serves a specific purpose: display a tooltip on hover to explain to
 * the user the purpose of the component and copy the content of component to the Clipboard.
 * The user can then paste the copied content elsewhere. The copied content remains in memory
 * until the user copies something else.
 * @param value - the value to be copied
 * @param copyText - (optional) text that will be displayed in the tooltip before copying
 * @param copiedText - (optional) text that will be displayed in the tooltip after copying
 * ```tsx
 *  <CopyToClipboard
 *    value='0x003410490050000320006570034567114572000'
 *   />
 * ```
 **/
const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  copyText = 'Copy to clipboard',
  copiedText = 'Copied',
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const onCopy = () => {
    copyToClipboard(value);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <Button onClick={onCopy} plain>
      <Tooltip content={copied ? copiedText : copyText} placement="bottom">
        {children}
      </Tooltip>
    </Button>
  );
};

export default CopyToClipboard;
