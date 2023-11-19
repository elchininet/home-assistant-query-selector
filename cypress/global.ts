import { HAQuerySelector } from '../src';

declare global {
  namespace Cypress {
    interface Chainable {
      onboard(): Chainable<void>;
    }
  }
  interface Window {
    HAQuerySelector: typeof HAQuerySelector;
  }
}

export {};