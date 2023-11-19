/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import 'cypress-wait-until';

Cypress.Commands.add('ingress', () => {

    cy.session('home-assistant', () => {

        cy
            .visit('http://localhost:8123')
            .location('pathname')
            .should('eq', '/lovelace/0');

    });
          

});

Cypress.Commands.add('waitForHomeAssistantDOM', () => {

    cy.waitUntil(() => (
        cy
            .get('home-assistant')
            .shadow()
            .find('home-assistant-main')
            .shadow()
            .find('ha-drawer partial-panel-resolver ha-panel-lovelace')
            .shadow()
            .find('hui-root')
            .shadow()
    ));

});