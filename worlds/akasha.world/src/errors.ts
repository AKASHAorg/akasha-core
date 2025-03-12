export const displayError = (message: string, rootNodeId: string) => {
  const htmlElem = document.getElementById(rootNodeId);
  const fofTpl = document.getElementById('four-oh-four-tpl');

  if (htmlElem && fofTpl) {
    htmlElem.innerHTML = fofTpl.innerHTML;
    const titleNode = htmlElem.querySelector('#title');
    const messageNode = htmlElem.querySelector('#message');
    const extraMessageNode = htmlElem.querySelector('#message_extra');
    const actionsNode = htmlElem.querySelector('#actions');
    htmlElem
      .querySelector('#four-oh-four-card')
      ?.classList.add('h-screen', 'justify-center', 'rounded-none');

    if (extraMessageNode) {
      extraMessageNode.textContent = '';
    }
    if (actionsNode) {
      actionsNode.textContent = '';
    }

    if (titleNode) {
      titleNode.textContent = 'Sorry, world is not available';
    }

    if (messageNode) {
      messageNode.textContent = message;
    }
  }
  return () => {
    if (htmlElem) {
      htmlElem.innerHTML = '';
    }
  };
};
