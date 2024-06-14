import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AllProviders } from './providers';
import { MockedResponse } from '@apollo/client/testing';

const renderWithWrapper = (
  component: React.ReactElement,
  wrapper: React.ComponentType,
  options: RenderOptions,
) => {
  return render(component, { wrapper, ...options });
};

/* Utility function to render with all required providers */
const renderWithAllProviders = (
  component: React.ReactElement,
  options: RenderOptions,
  providerProps?: { mocks: MockedResponse<unknown, unknown>[] },
) => {
  return render(component, {
    wrapper: () => React.createElement(AllProviders, { providerProps }, component),
    ...options,
  });
};

export * from '@testing-library/react';
export { renderWithWrapper, renderWithAllProviders };

export * from './data-generator';
export * from './mocks/single-spa';
export * from './mocks/uiEvents';
export * from './mocks/localStorage';
