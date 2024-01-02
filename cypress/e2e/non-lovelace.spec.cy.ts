import { HAQuerySelectorEvent } from '../../src';

describe('HAQuerySelector for non-lovelace dashboards', () => {

    it('Lovelace elements should be null', () => {

        cy.session('home-assistant', () => {

            cy
                .visit('http://localhost:8123/history')
                .location('pathname')
                .should('eq', '/history');
    
        });

        cy.waitUntil(() => (
            cy
                .get('home-assistant')
                .shadow()
                .find('home-assistant-main')
                .shadow()
                .find('ha-drawer partial-panel-resolver ha-panel-history')
                .shadow()
                .find('ha-top-app-bar-fixed')
                .shadow()
        ));

        cy
            .window()
            .then((win) => {
                const instance = new win.HAQuerySelector({
                    retries: 5,
                    delay: 5
                });
                const onPanelLoad = cy.stub().as('onPanelLoad');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_PANEL_LOAD,
                    onPanelLoad
                );
                instance.listen();
            });

        cy
            .get('@onPanelLoad')
            .should('be.calledOnce');

        cy
            .get('@onPanelLoad')
            .its('lastCall.args.0.detail')
            .then(async (elements) => {

                expect(
                    await elements.HA_PANEL_LOVELACE.element
                ).to.null;

                expect(
                    await elements.HUI_ROOT.element
                ).to.null;

                expect(
                    await elements.HEADER.element
                ).to.null;
            });

    });

});