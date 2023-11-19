import { HAQuerySelectorEvent, HAQuerySelector } from '../../src';

describe('HAQuerySelector', () => {

	let instance: HAQuerySelector;

  before(() => {
    cy
			.onboard()
			.window()
			.its('HAQuerySelector');

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

    cy.get('home-assistant')
      .shadow()
      .find('ha-more-info-dialog')
      .shadow()
      .find('ha-dialog ha-dialog-header ha-icon-button')
      .as('dialogHeaderButtons');

    cy
			.get('@dialogHeaderButtons')
			.eq(0)
			.click();

    cy.window().then((win) => {
      instance = new win.HAQuerySelector();
			const onLovelacePanelLoad = cy.stub().as('onLovelacePanelLoad');
      const onLovelaveMoreInfoDialogOpen = cy.stub().as('onLovelaveMoreInfoDialogOpen');
      const onLovelaveHistoryAndLogBookDialogOpen = cy.stub().as('onLovelaveHistoryAndLogBookDialogOpen');
      const onLovelaveSettingsDialogOpen = cy.stub().as('onLovelaveSettingsDialogOpen');
			instance.addEventListener(
				HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
				onLovelacePanelLoad
			);
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

  it('Tests', () => {
    cy.window().then((win) => {

      const doc = win.document;

      // 'Testing the callback

      cy
				.get('@onLovelacePanelLoad')
				.should('be.calledOnce');

      cy.log('Testing the elements type...');

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

			// Testing the elements

			cy
				.get('@onLovelacePanelLoad')
        .its('lastCall.args.0.detail')
        .then(async (elements) => {

          expect(await elements.HOME_ASSISTANT.element).to.be.equal(
            doc.querySelector('home-assistant')
          );

          expect(await elements.HOME_ASSISTANT_MAIN.element).to.be.equal(
            doc
              .querySelector('home-assistant')
              .shadowRoot
							.querySelector('home-assistant-main')
          );

          expect(await elements.HA_SIDEBAR.element).to.be.equal(
            doc
              .querySelector('home-assistant')
              .shadowRoot
							.querySelector('home-assistant-main')
              .shadowRoot
							.querySelector('ha-sidebar')
          );

          expect(await elements.HA_DRAWER.element).to.be.equal(
            doc
              .querySelector('home-assistant')
              .shadowRoot
							.querySelector('home-assistant-main')
              .shadowRoot
							.querySelector('ha-drawer')
          );

          expect(await elements.PARTIAL_PANEL_RESOLVER.element).to.be.equal(
            doc
              .querySelector('home-assistant')
              .shadowRoot
							.querySelector('home-assistant-main')
              .shadowRoot
							.querySelector('ha-drawer')
              .querySelector('partial-panel-resolver')
          );

          expect(await elements.HA_PANEL_LOVELACE.element).to.be.equal(
            doc
              .querySelector('home-assistant')
              .shadowRoot
							.querySelector('home-assistant-main')
              .shadowRoot
							.querySelector('ha-drawer')
              .querySelector('partial-panel-resolver')
              .querySelector('ha-panel-lovelace')
          );

          expect(await elements.HUI_ROOT.element).to.be.equal(
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

          expect(await elements.HEADER.element).to.be.equal(
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

          expect(await elements.HUI_VIEW.element).to.be.equal(
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

			// Checking query selectors

			cy
				.get('@onLovelacePanelLoad')
        .its('lastCall.args.0.detail')
        .then(async (elements) => {
          expect(
            await elements.HOME_ASSISTANT.querySelector('$ home-assistant-main$ ha-drawer')
          ).to.be.equal(await elements.HA_DRAWER.element);

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
							.querySelector('hui-root').shadowRoot
          );
        });

			// Checking non-existent elements

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

			// 'Fire when entering a lovelace dashboard after been left

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

			cy
				.get('@onLovelacePanelLoad')
				.should('not.be.calledTwice');

			cy
				.get('@links')
				.eq(0)
				.click();

			cy
				.get('@onLovelacePanelLoad')
				.should('be.calledTwice');

			cy.wrap(null).then(() => {
				instance.listen();
			});

			cy
				.get('@onLovelacePanelLoad')
				.should('be.calledThrice');

			// More info dialogs

			cy
				.get('@onLovelaveMoreInfoDialogOpen')
				.should('not.be.called');

			cy
				.get('@onLovelaveHistoryAndLogBookDialogOpen')
				.should('not.be.called');

			cy
				.get('@onLovelaveSettingsDialogOpen')
				.should('not.be.called');

			// Test that onLovelaveMoreInfoDialogOpen is called after opening a dialog

			cy
				.get('@card')
				.click();

			cy
				.get('@onLovelaveMoreInfoDialogOpen')
				.should('be.calledOnce');
			

    });

  });

});