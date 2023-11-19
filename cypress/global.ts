import { HAQuerySelector } from '../src';

declare global {
  namespace Cypress {
    interface Chainable {
      ingress(): Chainable<void>;
    }
  }
  interface Window {
    HAQuerySelector: typeof HAQuerySelector;
  }
}

export {};