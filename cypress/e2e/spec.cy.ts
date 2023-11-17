import { HomeAssistantElement, HAQuerySelector } from '../../src';

describe('HAQuerySelector tests', () => {

  // Promise to get the elements from the event
  const getOnInitElements = (instance: HAQuerySelector) => {
    return new Cypress.Promise<HomeAssistantElement>((resolve) => {
      const onLovelacePanelLoad = (event: CustomEvent) => {
        console.log('loaded', event.detail);
        instance.removeEventListener('onLovelacePanelLoad', onLovelacePanelLoad);
        resolve(event.detail);
      };
      instance.addEventListener('onLovelacePanelLoad', onLovelacePanelLoad);
      instance.listen();
    });
  };

  beforeEach(() => {
    cy
      .login()
      .window()
      .its('HAQuerySelector');
  });

  it('Check that the elements exist', () => {
    cy.window().then((win) => {
      const instance = new win.HAQuerySelector();
      cy.wrap(null).then(() => {
        return getOnInitElements(instance)
          .then(async (elements) => {
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
          });
      });
    });
  });

  it('Check that all the elements are Promises', () => {
    cy.window().then((win) => {
      const instance = new win.HAQuerySelector();
      cy.wrap(null).then(() => {
        return getOnInitElements(instance)
          .then(async (elements) => {
            expect(elements.HOME_ASSISTANT.element).to.be.instanceof(win.Promise);
            expect(elements.HOME_ASSISTANT_MAIN.element).to.be.instanceOf(win.Promise);
            expect(elements.HA_SIDEBAR.element).to.be.instanceOf(win.Promise);
            expect(elements.HA_DRAWER.element).to.be.instanceOf(win.Promise);
            expect(elements.PARTIAL_PANEL_RESOLVER.element).to.be.instanceOf(win.Promise);
            expect(elements.HA_PANEL_LOVELACE.element).to.be.instanceOf(win.Promise);
            expect(elements.HUI_ROOT.element).to.be.instanceOf(win.Promise);
            expect(elements.HEADER.element).to.be.instanceOf(win.Promise);
            expect(elements.HUI_VIEW.element).to.be.instanceOf(win.Promise);
          });
      });
    });
  });

  it('Elements tests', () => {
    cy.window().then((win) => {
      const doc = win.document;
      const instance = new win.HAQuerySelector();
      cy.wrap(null).then(() => {
        return getOnInitElements(instance)
          .then(async (elements) => {

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

          });
      });
    });
  });

  it('Check query selectors', () => {
    cy.window().then((win) => {
      const doc = win.document;
      const instance = new win.HAQuerySelector();
      cy.wrap(null).then(() => {
        return getOnInitElements(instance)
          .then(async (elements) => {

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

          });
      });
    });
  });

  it('Query for non-existent elements', () => {
    cy.window().then((win) => {
      const instance = new win.HAQuerySelector();
      cy.wrap(null).then(() => {
        return getOnInitElements(instance)
          .then(async (elements) => {

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

  it('Fire when entering a lovelace dashboard after been left', () => {
    cy.window().then((win) => {

      const instance = new win.HAQuerySelector();
      const onLovelacePanelLoad = cy.stub().as('listener');
      instance.addEventListener('onLovelacePanelLoad', onLovelacePanelLoad);

      cy.wrap(null).then(() => {
        instance.listen();
      });

      cy
        .get('@listener')
        .should('be.calledOnce');

      cy
        .get('home-assistant')
        .shadow()
        .find('home-assistant-main')
        .shadow()
        .find('ha-sidebar')
        .shadow()
        .find('a[role="option"]')
        .as('links');

      cy
        .get('@links')
        .eq(4)
        .click();

      cy
        .get('@listener')
        .should('not.be.calledTwice');

      cy
        .get('@links')
        .eq(0)
        .click();

      cy
        .get('@listener')
        .should('be.calledTwice');

      cy.wrap(null).then(() => {
        instance.listen();
      });

      cy
        .get('@listener')
        .should('be.calledThrice');

    });
  });

  it('Finished', () => {
    expect(true).to.equal(true);
  });

});