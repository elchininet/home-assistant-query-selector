import { HAQuerySelectorEvent, HAQuerySelector } from '../../src';

describe('HAQuerySelector for more-info dialogs', () => {

    let instance: HAQuerySelector;

    beforeEach(() => {
        cy
            .ingress()
            .window()
            .its('HAQuerySelector');

        cy.waitForHomeAssistantDOM();

        cy
            .get('home-assistant')
            .shadow()
            .find('home-assistant-main')
            .shadow()
            .find('ha-panel-lovelace')
            .shadow()
            .find('hui-root')
            .shadow()
            .find('hui-masonry-view')
            .shadow()
            .find('hui-entities-card')
            .shadow()
            .find('ha-card')
            .as('card');

        cy
            .get('@card')
            .click();

        cy
            .get('home-assistant')
            .shadow()
            .find('ha-more-info-dialog')
            .shadow()
            .find('ha-dialog ha-dialog-header')
            .as('dialog-header');

        cy
            .get('@dialog-header')
            .find('ha-icon-button')
            .as('dialogHeaderButtons');

        cy
            .get('@dialogHeaderButtons')
            .eq(0)
            .click();

        cy
            .window()
            .then((win) => {
                instance = new win.HAQuerySelector();
                const onLovelaveMoreInfoDialogOpen = cy.stub().as('onLovelaveMoreInfoDialogOpen');
                const onLovelaveHistoryAndLogBookDialogOpen = cy.stub().as('onLovelaveHistoryAndLogBookDialogOpen');
                const onLovelaveSettingsDialogOpen = cy.stub().as('onLovelaveSettingsDialogOpen');
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_LOVELACE_MORE_INFO_DIALOG_OPEN,
                    onLovelaveMoreInfoDialogOpen
                );
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_LOVELACE_HISTORY_AND_LOGBOOK_DIALOG_OPEN,
                    onLovelaveHistoryAndLogBookDialogOpen
                );
                instance.addEventListener(
                    HAQuerySelectorEvent.ON_LOVELACE_SETTINGS_DIALOG_OPEN,
                    onLovelaveSettingsDialogOpen
                );
                instance.listen();
            });
    });

    afterEach(() => {

        cy
            .get('body')
            .then((body) => {

                if (body.attr('style').includes('overflow')) {

                    cy
                        .get('@dialogHeaderButtons')
                        .eq(0)
                        .click();

                }

            });

    });

    it('All the more-info dialog elements should exist', () => {

        // At the beginning none of the event should be triggered
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('not.be.called');
            
        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('not.be.called');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('not.be.called');

        // Open a more-info dialog
        cy
            .get('@card')
            .click();

        // Only onLovelaveMoreInfoDialogOpen should be triggered
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('not.be.called');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('not.be.called');

        // Check the shape of the onLovelaveMoreInfoDialogOpen
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .its('lastCall.args.0.detail')
            .then((elements) => {
                expect(elements).to.have.keys([
                    'HA_MORE_INFO_DIALOG',
                    'HA_DIALOG',
                    'HA_DIALOG_CONTENT',
                    'HA_MORE_INFO_DIALOG_INFO'
                ]);
            });

        // Open the history and logbook
        cy
            .get('@dialogHeaderButtons')
            .eq(1)
            .click();

        // Only the onLovelaveHistoryAndLogBookDialogOpen should be triggered
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('not.be.called');

        // Check the shape of the onLovelaveHistoryAndLogBookDialogOpen
        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .its('lastCall.args.0.detail')
            .then((elements) => {
                expect(elements).to.have.keys([
                    'HA_MORE_INFO_DIALOG',
                    'HA_DIALOG',
                    'HA_DIALOG_CONTENT',
                    'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK'
                ]);
            });

        // Return to the more-info dialog
        cy
            .get('@dialog-header')
            .find('ha-icon-button-prev')
            .click();

        // onLovelaveMoreInfoDialogOpen should be triggered twice
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('be.calledTwice');

        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('not.be.called');

        
        // Open the config
        cy
            .get('@dialogHeaderButtons')
            .eq(2)
            .click();

        // Only onLovelaveSettingsDialogOpen should be triggered
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('be.calledTwice');

        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('be.calledOnce');

        // Check the shape of the onLovelaveSettingsDialogOpen
        cy
            .get('@onLovelaveSettingsDialogOpen')
            .its('lastCall.args.0.detail')
            .then((elements) => {
                expect(elements).to.have.keys([
                    'HA_MORE_INFO_DIALOG',
                    'HA_DIALOG',
                    'HA_DIALOG_CONTENT',
                    'HA_DIALOG_MORE_INFO_SETTINGS'
                ]);
            });

        // Return to the more-info dialog
        cy
            .get('@dialog-header')
            .find('ha-icon-button-prev')
            .click();

        // onLovelaveMoreInfoDialogOpen should be triggered thrice
        cy
            .get('@onLovelaveMoreInfoDialogOpen')
            .should('be.calledThrice');

        cy
            .get('@onLovelaveHistoryAndLogBookDialogOpen')
            .should('be.calledOnce');

        cy
            .get('@onLovelaveSettingsDialogOpen')
            .should('be.calledOnce');
        
    });

    it('All the more-info dialog elements should be Promises', () => {

        cy
            .window()
            .then((win) => {

                cy
                    .get('@card')
                    .click();

                cy
                    .get('@onLovelaveMoreInfoDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then((elements) => {
                        expect(elements.HA_MORE_INFO_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG_CONTENT.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_MORE_INFO_DIALOG_INFO.element).to.be.instanceOf(win.Promise);
                    });

                // Open the history and logbook
                cy
                    .get('@dialogHeaderButtons')
                    .eq(1)
                    .click();
                    
                cy
                    .get('@onLovelaveHistoryAndLogBookDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then((elements) => {
                        expect(elements.HA_MORE_INFO_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG_CONTENT.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK.element).to.be.instanceOf(win.Promise);
                    });

                // Return to the more-info dialog
                cy
                    .get('@dialog-header')
                    .find('ha-icon-button-prev')
                    .click();

                // Open the config
                cy
                    .get('@dialogHeaderButtons')
                    .eq(2)
                    .click();

                cy
                    .get('@onLovelaveSettingsDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then((elements) => {
                        expect(elements.HA_MORE_INFO_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG_CONTENT.element).to.be.instanceOf(win.Promise);
                        expect(elements.HA_DIALOG_MORE_INFO_SETTINGS.element).to.be.instanceOf(win.Promise);
                    });

                // Return to the more-info dialog
                cy
                    .get('@dialog-header')
                    .find('ha-icon-button-prev')
                    .click();

            });

        
    });

    it('The more-info dialog elements\' Promises should resolve in the proper DOM elements', () => {

        cy
            .window()
            .then((win) => {

                const doc = win.document;

                cy
                    .get('@card')
                    .click();

                cy
                    .get('@onLovelaveMoreInfoDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {
                        
                        expect(
                            await elements.HA_MORE_INFO_DIALOG.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                        );

                        expect(
                            await elements.HA_DIALOG.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                                .shadowRoot
                                .querySelector('ha-dialog')
                        );

                        expect(
                            await elements.HA_DIALOG_CONTENT.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                                .shadowRoot
                                .querySelector('ha-dialog .content')
                        );

                        expect(
                            await elements.HA_MORE_INFO_DIALOG_INFO.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                                .shadowRoot
                                .querySelector('ha-dialog .content ha-more-info-info')
                        );

                    });

                // Open the history and logbook
                cy
                    .get('@dialogHeaderButtons')
                    .eq(1)
                    .click();

                    cy
                    .get('@onLovelaveHistoryAndLogBookDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {

                        expect(
                            await elements.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                                .shadowRoot
                                .querySelector('ha-dialog .content ha-more-info-history-and-logbook')
                        );

                    });

                // Return to the more-info dialog
                cy
                    .get('@dialog-header')
                    .find('ha-icon-button-prev')
                    .click();

                // Open the config
                cy
                    .get('@dialogHeaderButtons')
                    .eq(2)
                    .click();

                    cy
                    .get('@onLovelaveSettingsDialogOpen')
                    .its('lastCall.args.0.detail')
                    .then(async (elements) => {
                        
                        expect(
                            await elements.HA_DIALOG_MORE_INFO_SETTINGS.element
                        ).to.be.equal(
                            doc
                                .querySelector('home-assistant')
                                .shadowRoot
                                .querySelector('ha-more-info-dialog')
                                .shadowRoot
                                .querySelector('ha-dialog .content ha-more-info-settings')
                        );

                    });

                // Return to the more-info dialog
                cy
                    .get('@dialog-header')
                    .find('ha-icon-button-prev')
                    .click();

            });

    });

});