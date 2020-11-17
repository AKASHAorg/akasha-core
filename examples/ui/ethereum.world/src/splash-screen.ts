import createTemplateElement from './create-template-element';

export default createTemplateElement(`
<div id="splash-screen" style="display: flex; flex-direction: column; height: 100%; align-items:center; justify-content: center; color: #808080;">
    <img src="/icons/icon-144x144.png" alt="Loading" />
    <h1 style="font-size: medium; font-weight: 400; font-family: system-ui;">Loading. Please wait...</h1>
</div>
`);
