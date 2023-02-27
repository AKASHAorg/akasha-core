import React, { PropsWithChildren, useState } from 'react';
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

  const onCopy = () => {
    navigator.clipboard.writeText(value);
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
    <button onClick={onCopy}>
      <Tooltip content={copied ? copiedText : copyText} placement="right">
        {children}
      </Tooltip>
    </button>
  );
};

export default CopyToClipboard;
