import { HAQuerySelectorEvent, HAQuerySelector } from '../../src';

describe('HAQuerySelector for lovelace dashboards', () => {
    
    let instance: HAQuerySelector;

    beforeEach(() => {
        cy
            .ingress()
            .window()
            .its('HAQuerySelector');

        cy.waitForHomeAssistantDOM();

        cy
            .window()
            .then((win) => {
                instance = new win.HAQuerySelector();
                const onPanelLoad = cy.stub().as('onPanelLoad');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_PANEL_LOAD,
                    onPanelLoad
                );
                instance.listen();
            });
    });

    it('All the elements should exist', () => {
        cy
            .get('@onPanelLoad')
            .should('be.calledOnce');
        cy
            .get('@onPanelLoad')
            .its('lastCall.args.0.detail')
            .then((elements) => {
                expect(elements).to.have.keys([
                    'HOME_ASSISTANT',
                    'HOME_ASSISTANT_MAIN',
                    'HA_SIDEBAR',
                    'HA_DRAWER',
                    'PARTIAL_PANEL_RESOLVER',
                    'HA_PANEL_LOVELACE',
                    'HUI_ROOT',
                    'HEADER',
                    'HUI_VIEW',
                ]);
            });
    });

    it('All the elements should be Promises', () => {
        cy
            .window()
            .then((win) => {
                cy
                    .get('@onPanelLoad')
                    .its('lastCall.args.0.detail')
                    .then((elements) => {
                        expect(elements.HOME_ASSISTANT.element).to.be.instanceOf(win.Promise);
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

    it('The elements\' Promises should resolve in the proper DOM elements', () => {
        
        cy
            .window()
            .then((win) => {

                const doc = win.document;

                cy
                    .get('@onPanelLoad')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {

                        expect(
                            await elements.HOME_ASSISTANT.element
                        ).to.be.equal(
                            doc.querySelector('home-assistant')
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

    it('selector should return the proper elements', () => {
        
        cy
            .window()
            .then((win) => {

                const doc = win.document;

                cy
                    .get('@onPanelLoad')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {

                        expect(
                            await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('ha-drawer').element
                        ).to.be.equal(
                            await elements.HA_DRAWER.element
                        );

                        expect(
                            await elements.HOME_ASSISTANT.selector.deepQuery('ha-drawer').element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('home-assistant-main')
                                .shadowRoot
                                .querySelector('ha-drawer')
                        );

                        expect(
                            await elements.HOME_ASSISTANT_MAIN.selector.$.query('ha-drawer ha-panel-lovelace').$.query('hui-root').$.query('.header .action-items > ha-button-menu').all
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
                            await elements.HA_PANEL_LOVELACE.selector.$.query('hui-root').$.element
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

    it('Non-existent elements should return null', () => {

        cy
            .window()
            .then((win) => {
                const instance = new win.HAQuerySelector({
                    retries: 1,
                    delay: 2
                });
                const onPanelLoad = cy.stub().as('localOnPanelLoad');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_PANEL_LOAD,
                    onPanelLoad
                );
                instance.listen();
                
                cy
                    .get('@localOnPanelLoad')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {
                        expect(
                            await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').element
                        ).to.null;

                        expect(
                            (
                                await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').all
                            ).length
                        ).to.be.equal(0);

                        expect(
                            await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').$.element
                        ).to.null;
                    });

            });

    });

    it('onPanelLoad should be triggered when returning to the dashboard', () => {
        
        cy.get('home-assistant')
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

        cy.wait(1000);

        cy
            .get('@onPanelLoad')
            .should('not.be.calledTwice');

        cy
            .get('@links')
            .eq(0)
            .click();

        cy.wait(1000);

        cy
            .get('@onPanelLoad')
            .should('be.calledTwice');

        cy.wait(1000);

        cy.wrap(null).then(() => {
            instance.listen();
            return cy.wait(1000);
        });

        cy
            .get('@onPanelLoad')
            .should('be.calledThrice');

    });

    it('Remove events should remove the listeners', () => {
        
        cy
            .window()
            .then((win) => {
                const instance = new win.HAQuerySelector();
                const onPanelLoad = cy.stub().as('onPanelLoadLocal');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_PANEL_LOAD,
                    onPanelLoad
                );

                instance.listen();

                cy
                    .get('@onPanelLoadLocal')
                    .should('be.calledOnce');

                instance.removeEventListener(
                    HAQuerySelectorEvent.ON_PANEL_LOAD,
                    onPanelLoad
                );

                instance.listen();

                cy
                    .get('@onPanelLoadLocal')
                    .should('not.be.calledTwice');

            });

    });

});