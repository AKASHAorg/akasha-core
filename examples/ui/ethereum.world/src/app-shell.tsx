import * as React from 'react';

const AppShell = () => (
  <div>
    <h1>Typescript</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading Button">
      <>Test!</>
    </React.Suspense>
  </div>
);

export default AppShell;
