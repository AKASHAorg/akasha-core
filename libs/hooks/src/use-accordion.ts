import { useState } from 'react';

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
