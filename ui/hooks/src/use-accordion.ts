import { useState } from 'react';

/**
 * Hook to handle the closing and opening of the Accordion component
 * @example useAccordion hook
 * ```typescript
 *   const { active, setActive, handleAccordionClick } = useAccordion();
 * ```
 * Explanation:
 *   - Use `setActive` to set active a sub-menu of an accordion. It
 * take an index as a parameter:
 * ```typescript
 *   setActive('index of the sub-menu you want to make active')
 * ```
 *   - Use `handleAccordionClick` to collapse the accordion when clicking
 */
export function useAccordion() {
  const [active, setActive] = useState<number | null>(null);

  const handleAccordionClick = (id: number) => {
    /**
     * if id is already active, set null so as to collapse it
     */
    if (id === active) {
      setActive(null);
    } else {
      setActive(id);
    }
  };

  return { active, setActive, handleAccordionClick };
}
