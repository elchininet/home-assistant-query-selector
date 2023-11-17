import { HAQuerySelector } from '../src';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
  interface Window {
    HAQuerySelector: typeof HAQuerySelector;
  }
}

export {};