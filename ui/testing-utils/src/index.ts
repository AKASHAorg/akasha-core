import { render, RenderOptions } from "@testing-library/react";
import React from "react";
import { AllProviders } from "./providers";
// import reactI18next from 'react-i18next';

// const installMocks = (origI18next: typeof reactI18next) => {
//   jest.mock('react-i18next', () => ({
//     useTranslation: () => {
//       return {
//         t: (str: string) => str,
//         i18n: {
//           changeLanguage: () => new Promise(() => { }),
//         },
//       };
//     },
//     I18nextProvider: origI18next.I18nextProvider,
//   }));
// }

// installMocks(reactI18next);



const renderWithWrapper = (component: React.ReactElement, wrapper: React.ComponentType, options: RenderOptions) => {
  return render(component, { wrapper, ...options });
}

/* Utility function to render with all required providers */
const renderWithAllWrappers = (component: React.ReactElement, options: RenderOptions) => {
  return render(component, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { renderWithWrapper, renderWithAllWrappers };

export * from './data-generator';
