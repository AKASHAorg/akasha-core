const SPLASH_TEMPLATE_ID = '#splash-screen-tpl';
const FOUR_OH_FOUR_TEMPLATE_ID = '#four-oh-four-tpl';

/**
 * Show the splash screen
 */
export const showPageSplash = (): void => {
  const template: HTMLTemplateElement | null = document.querySelector(SPLASH_TEMPLATE_ID);
  if (template) {
    const content = template.content;
    document.body.appendChild(content.cloneNode(true));
  }
};
/**
 * Hide the splash screen
 */
export const hidePageSplash = (): void => {
  const template: HTMLTemplateElement | null = document.querySelector(SPLASH_TEMPLATE_ID);
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

export const show404 = (parentId: string, appName: string, extensionAppUrl: string): void => {
  const template: HTMLTemplateElement | null = document.querySelector(FOUR_OH_FOUR_TEMPLATE_ID);
  const templateRootNode = template.content.firstElementChild;
  if (template) {
    const parentNode = document.getElementById(parentId);
    template.content
      .getElementById('search-extension-button')
      .setAttribute('href', extensionAppUrl);
    if (parentNode && !parentNode.querySelector(templateRootNode.id)) {
      parentNode.appendChild(template.content.cloneNode(true));
      const appNameNode: HTMLElement | null = document.querySelector(
        `#${templateRootNode.id} #app-name`,
      );
      if (appNameNode) {
        appNameNode.innerText = appName;
      }
    }
  }
};

export const hide404 = (parentId: string): void => {
  const template: HTMLTemplateElement | null = document.querySelector(FOUR_OH_FOUR_TEMPLATE_ID);
  if (template) {
    const rootNode = template.content.firstElementChild;
    const parentNode = document.getElementById(parentId);
    if (rootNode && parentNode && document.getElementById(rootNode.id)) {
      parentNode.removeChild(document.getElementById(rootNode.id));
    }
  }
};
