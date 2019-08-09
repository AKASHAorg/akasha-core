export default function fourOhFour(otherRoutes): string {
  const htmlString = `
        <div style="display: flex; flex-direction: column; height: 100%; align-items:center; justify-content: center; color: #808080">
            <h1 style="font-size: 5em">404</h1>
            <p>The page you are looking for does not exist.</p>
            <p>You can try to navigate to other pages like:</p>
            ${otherRoutes
              .map(route => {
                if (route.title) {
                  return `<a href="${route.activeWhen.path}">${route.title}</a>`;
                }
                return null;
              })
              .join('')}
        </div>
    `;
  return htmlString;
}
