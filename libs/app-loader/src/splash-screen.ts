/**
 * Show the splash screen
 */
export const showPageSplash = (): void => {
  const template: HTMLTemplateElement | null = document.querySelector('#splash-screen-tpl');
  if (template) {
    const content = template.content;
    document.body.appendChild(content.cloneNode(true));
  }
};
/**
 * Hide the splash screen
 */
export const hidePageSplash = (): void => {
  const template: HTMLTemplateElement | null = document.querySelector('#splash-screen-tpl');
  if (template) {
    const splashNode = template.content.firstElementChild;
    if (splashNode) {
      const nodeId = splashNode.id;
      const nodeToRm = Array.from(document.body.children).find(n => n.id === nodeId);
      if (nodeToRm) {
        document.body.removeChild(nodeToRm);
      }
    }
  }
};
