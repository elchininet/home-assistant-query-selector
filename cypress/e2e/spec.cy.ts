import { HomeAssistantElement } from '../../src';

describe('template spec', () => {
  it('passes', () => {
    cy.login();
    cy.window().its('HAQuerySelector');
    cy.window()
      .then((win) => {

        const doc = win.document;
        const instance = new win.HAQuerySelector();

        // Promise to get the elements from the event
        const getOnInitElements = () => {
          return new Cypress.Promise<HomeAssistantElement>((resolve) => {
            const onLovelacePanelLoad = (event: CustomEvent) => {
              instance.removeEventListener('onLovelacePanelLoad', onLovelacePanelLoad);
              resolve(event.detail);
            };
            instance.addEventListener('onLovelacePanelLoad', onLovelacePanelLoad);
            instance.init();
          });
        };

        cy.wrap(null).then(() => {
          return getOnInitElements()
            .then(async (elements) => {

              // Check the returned properties
              expect(Object.keys(elements).sort()).to.deep.equal([
                'HOME_ASSISTANT',
                'HOME_ASSISTANT_MAIN',
                'HA_SIDEBAR',
                'HA_DRAWER',
                'PARTIAL_PANEL_RESOLVER',
                'HA_PANEL_LOVELACE',
                'HUI_ROOT',
                'HEADER',
                'HUI_VIEW'
              ].sort());
              
              // Check that all the properties are Promises
              expect(elements.HOME_ASSISTANT.element).to.be.instanceof(win.Promise);
              expect(elements.HOME_ASSISTANT_MAIN.element).to.be.instanceOf(win.Promise);
              expect(elements.HA_SIDEBAR.element).to.be.instanceOf(win.Promise);
              expect(elements.HA_DRAWER.element).to.be.instanceOf(win.Promise);
              expect(elements.PARTIAL_PANEL_RESOLVER.element).to.be.instanceOf(win.Promise);
              expect(elements.HA_PANEL_LOVELACE.element).to.be.instanceOf(win.Promise);
              expect(elements.HUI_ROOT.element).to.be.instanceOf(win.Promise);
              expect(elements.HEADER.element).to.be.instanceOf(win.Promise);
              expect(elements.HUI_VIEW.element).to.be.instanceOf(win.Promise);

              // Chck the elements
              expect(
                await elements.HOME_ASSISTANT.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
              );

              expect(
                await elements.HOME_ASSISTANT_MAIN.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
              );

              expect(
                await elements.HA_SIDEBAR.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-sidebar')
              );

              expect(
                await elements.HA_DRAWER.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
              );

              expect(
                await elements.PARTIAL_PANEL_RESOLVER.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
              );

              expect(
                await elements.HA_PANEL_LOVELACE.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
              );

              expect(
                await elements.HUI_ROOT.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
                  .shadowRoot
                  .querySelector('hui-root')
              );

              expect(
                await elements.HEADER.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
                  .shadowRoot
                  .querySelector('hui-root')
                  .shadowRoot
                  .querySelector('.header')
              );

              expect(
                await elements.HUI_VIEW.element
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
                  .shadowRoot
                  .querySelector('hui-root')
                  .shadowRoot
                  .querySelector('hui-view')
              );

              expect(
                await elements.HOME_ASSISTANT.querySelector('$ home-assistant-main$ ha-drawer')
              ).to.be.equal(
                await elements.HA_DRAWER.element
              );

              expect(
                await elements.HOME_ASSISTANT_MAIN.querySelectorAll('$ ha-drawer ha-panel-lovelace$ hui-root$ .header .action-items > ha-button-menu')
              ).to.deep.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
                  .shadowRoot
                  .querySelector('hui-root')
                  .shadowRoot
                  .querySelectorAll('.header .action-items > ha-button-menu')
                  
              );

              expect(
                await elements.HA_PANEL_LOVELACE.shadowRootQuerySelector('$ hui-root$')
              ).to.be.equal(
                doc
                  .querySelector('home-assistant')
                  .shadowRoot
                  .querySelector('home-assistant-main')
                  .shadowRoot
                  .querySelector('ha-drawer')
                  .querySelector('partial-panel-resolver')
                  .querySelector('ha-panel-lovelace')
                  .shadowRoot
                  .querySelector('hui-root')
                  .shadowRoot
              );

              // Query non-existent elements should return null
              expect(
                await elements.HOME_ASSISTANT.querySelector('$ home-assistant-main$ do-not-exists', { retries: 5, delay: 1})
              ).to.null;

              expect(
                (await elements.HOME_ASSISTANT.querySelectorAll('$ home-assistant-main$ do-not-exists', { retries: 5, delay: 1})).length
              ).to.be.equal(0);

              expect(
                await elements.HOME_ASSISTANT.shadowRootQuerySelector('$ home-assistant-main$ do-not-exists$', { retries: 5, delay: 1})
              ).to.null;

            });
        });
      });
  });
});