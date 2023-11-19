import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    testIsolation: false,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 15000
  },
  screenshotOnRunFailure: false,
});
