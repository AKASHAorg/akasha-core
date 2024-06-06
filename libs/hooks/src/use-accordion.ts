import { useState } from 'react';

/**
 * Hook to manipulate the state of the Accordion component.
 * @returns { activeAccordionId, setActiveAccordionId, handleAccordionClick } - Object containing the active accordion ID, and
 * methods for handling click events and setting an active ID.
 * @example useAccordion hook
 * ```typescript
 *  const { activeAccordionId, setActiveAccordionId, handleAccordionClick } = useAccordion();
 * ```
 **/
export function useAccordion() {
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);

  const handleAccordionClick = (accordionId: string) => {
    /**
     * if id is already active, set null so as to collapse it
     */
    if (accordionId === activeAccordionId) {
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(accordionId);
    }
  };

  return { activeAccordionId, setActiveAccordionId, handleAccordionClick };
}
