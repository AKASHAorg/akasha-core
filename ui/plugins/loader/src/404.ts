export default function fourOhFour(
  otherRoutes,
  onNavigation: (path: string) => EventHandlerNonNull,
): ChildNode {
  const htmlString = `
        <div id="four-oh-four" style="display: flex; flex-direction: column; height: 100%; align-items:center; justify-content: center; color: #808080">
            <h1 style="font-size: 5em">404</h1>
            <p>The page you are looking for does not exist.</p>
            <p>You can try to navigate to other pages like:</p>
            ${otherRoutes
              .map(route => {
                if (route.title) {
                  // const node = document.createElement('div');
                  // const link = document.createElement('a');
                  // link.href = '#';
                  // link.addEventListener('click', onNavigation(route.activeWhen.path));
                  // link.innerHTML = route.title;
                  // node.appendChild(link)
                  // return node.innerHTML;
                  return `<a id="${route.activeWhen.path}" href="${route.activeWhen.path}">${route.title}</a>`;
                }
                return null;
              })
              .join('')}
        </div>
    `;
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  otherRoutes.forEach(route => {
    template.content
      .getElementById(route.activeWhen.path)
      .addEventListener('click', onNavigation(route.activeWhen.path));
  });
  return template.content.firstChild;
}
