export default function fourOhFour(): ChildNode {
  const htmlString = `
        <div id="four-oh-four" style="display: flex; flex-direction: column; height: 100%; align-items:center; justify-content: center; color: #808080">
            <h1 style="font-size: 5em">404</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    `;
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}
