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

const NAME = 'Test';
const USERNAME = 'test';
const PASSWORD = 'Test123!';

Cypress.Commands.add('login', () => {
    cy.visit('http://localhost:8123');

    cy.wrap(null).then(() => {
        cy.get('#ha-launch-screen').should('not.exist');
    });
    
    cy
        .get('body')
        .then(function ($body) {

            if ($body.find('ha-onboarding').length) {

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-welcome')
                    .shadow()
                    .find('ha-button')
                    .click();

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-create-user')
                    .shadow()
                    .as('create-user');

                cy
                    .get('@create-user')
                    .find('ha-form')
                    .shadow()
                    .as('form');

                cy
                    .get('@form')
                    .find('ha-selector:nth-of-type(1)')
                    .shadow()
                    .find('ha-selector-text')
                    .shadow()
                    .find('ha-textfield')
                    .shadow()
                    .find('input[name="name"]')
                    .click()
                    .type(NAME);

                cy
                    .get('@form')
                    .find('ha-selector:nth-of-type(3)')
                    .shadow()
                    .find('ha-selector-text')
                    .shadow()
                    .find('ha-textfield')
                    .shadow()
                    .find('input[name="password"]')
                    .click()
                    .type(PASSWORD);

                cy
                    .get('@form')
                    .find('ha-selector:nth-of-type(4)')
                    .shadow()
                    .find('ha-selector-text')
                    .shadow()
                    .find('ha-textfield')
                    .shadow()
                    .find('input[name="password_confirm"]')
                    .click()
                    .type(PASSWORD);

                cy
                    .get('@create-user')
                    .find('.footer mwc-button')
                    .click();

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-core-config')
                    .shadow()
                    .find('onboarding-location')
                    .shadow()
                    .find('.footer mwc-button')
                    .click();

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-core-config')
                    .shadow()
                    .as('form-country');

                cy
                    .get('@form-country')
                    .find('ha-country-picker')
                    .shadow()
                    .find('ha-select')
                    .as('select');

                cy
                    .get('@select')
                    .click();

                cy
                    .get('@select')
                    .find('ha-list-item:nth-of-type(1)')
                    .click();

                cy
                    .get('@form-country')
                    .find('.footer mwc-button')
                    .click();

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-analytics')
                    .shadow()
                    .find('.footer mwc-button')
                    .click();

                cy
                    .get('ha-onboarding')
                    .shadow()
                    .find('onboarding-integrations')
                    .shadow()
                    .find('.footer mwc-button')
                    .click();

            } else if ($body.find('ha-authorize').length) {
                
                cy
                    .get('input[name="username"]')
                    .type(USERNAME);

                cy
                    .get('input[type="password"]')
                    .type(PASSWORD);

                cy
                    .get('ha-checkbox')
                    .click();

                cy
                    .get('.action > mwc-button')
                    .click();

            }

        });

    /*
    

    */
          

});