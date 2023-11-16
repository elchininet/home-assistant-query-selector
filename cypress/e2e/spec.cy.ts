describe('template spec', () => {
  it('passes', () => {
    cy.onboarding();
    cy.window()
      .then((window) => {
        expect(window).to.haveOwnProperty('HAQuerySelector');
        const instance = new window.HAQuerySelector();
        instance.addEventListener('onLovelacePanelLoad', (event: CustomEvent) => {
          console.log('onLovelacePanelLoad', event.detail);
        });
        instance.addEventListener('onLovelacePanelChange', (event: CustomEvent) => {
          console.log('onLovelacePanelChange', event.detail);
        });
        instance.init();
      });
  });
});