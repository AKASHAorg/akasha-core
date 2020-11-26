export default function createTemplateElement(htmlString): ChildNode | null {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}
