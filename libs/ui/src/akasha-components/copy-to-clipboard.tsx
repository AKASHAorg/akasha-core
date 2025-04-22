import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/akasha-components/tooltip';

function CopyToClipboard({
  textToCopy,
  ctaText = 'Copy to clipboard',
  successText = 'Copied',
  resetDuration = 5000,
  asChild,
  children,
  side = 'top',
  ...props
}: React.ComponentProps<typeof TooltipProvider> &
  React.PropsWithChildren<{
    textToCopy: string;
    ctaText?: string;
    successText?: string;
    resetDuration?: number;
    asChild?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
  }>) {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), resetDuration);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handlePointerDown = (event: { target: EventTarget | null }) => {
    const target = event.target as Node;
    // Only clicking outside the trigger closes the tooltip
    if (!triggerRef.current?.contains(target)) {
      handleTooltipClose();
    }
  };

  return (
    <TooltipProvider data-slot="copy-to-clipboard" {...props}>
      <Tooltip open={open}>
        <TooltipTrigger
          onClick={copyToClipboard}
          ref={triggerRef}
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
          asChild={asChild}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent onPointerDownOutside={handlePointerDown} side={side}>
          {copied ? successText : ctaText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { CopyToClipboard };
