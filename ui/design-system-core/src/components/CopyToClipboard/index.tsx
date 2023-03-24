import React, { PropsWithChildren, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import Button from '../Button';
import Tooltip from '../Tooltip';

type CopyToClipboardChildren = {
  value: string;
  copyText?: string;
  copiedText?: string;
};
const CopyToClipboard: React.FC<PropsWithChildren<CopyToClipboardChildren>> = ({
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

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <Button onClick={onCopy} plain>
      <Tooltip content={copied ? copiedText : copyText} placement="right">
        {children}
      </Tooltip>
    </Button>
  );
};

export default CopyToClipboard;
