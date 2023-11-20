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
                const onLovelacePanelLoad = cy.stub().as('onLovelacePanelLoad');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
                    onLovelacePanelLoad
                );
                instance.listen();
            });
    });

    it('All the elements should exist', () => {
        cy
            .get('@onLovelacePanelLoad')
            .should('be.calledOnce');
        cy
            .get('@onLovelacePanelLoad')
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
                    .get('@onLovelacePanelLoad')
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
                    .get('@onLovelacePanelLoad')
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

    it('querySelector, querySelectorAll and shadowRootQuerySelector should return the proper elements', () => {
        
        cy
            .window()
            .then((win) => {

                const doc = win.document;

                cy
                    .get('@onLovelacePanelLoad')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {

                        expect(
                            await elements.HOME_ASSISTANT.querySelector('$ home-assistant-main$ ha-drawer')
                        ).to.be.equal(
                            await elements.HA_DRAWER.element
                        );

                        expect(
                            await elements.HOME_ASSISTANT_MAIN.querySelectorAll(
                                '$ ha-drawer ha-panel-lovelace$ hui-root$ .header .action-items > ha-button-menu'
                            )
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

    it('Non-existent elements should return null', () => {
        
        cy
            .get('@onLovelacePanelLoad')
            .its('lastCall.args.0.detail')
            .then(async (elements) => {
                expect(
                    await elements.HOME_ASSISTANT.querySelector(
                        '$ home-assistant-main$ do-not-exists',
                        { retries: 5, delay: 1 }
                    )
                ).to.null;

                expect(
                    (
                        await elements.HOME_ASSISTANT.querySelectorAll(
                            '$ home-assistant-main$ do-not-exists',
                            { retries: 5, delay: 1 }
                        )
                    ).length
                ).to.be.equal(0);

                expect(
                    await elements.HOME_ASSISTANT.shadowRootQuerySelector(
                        '$ home-assistant-main$ do-not-exists$',
                        { retries: 5, delay: 1 }
                    )
                ).to.null;
            });

    });

    it('onLovelacePanelLoad should be triggered when returning to the dashboard', () => {
        
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
            .get('@onLovelacePanelLoad')
            .should('not.be.calledTwice');

        cy
            .get('@links')
            .eq(0)
            .click();

        cy.wait(1000);

        cy
            .get('@onLovelacePanelLoad')
            .should('be.calledTwice');

        cy.wait(1000);

        cy.wrap(null).then(() => {
            instance.listen();
        });

        cy
            .get('@onLovelacePanelLoad')
            .should('be.calledThrice');

    });

});