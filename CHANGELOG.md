# Changelog

## [2.1.0] - 2023-12-05

- Update `shadow-dom-selector` and use the new dot notation syntax

## [2.0.0] - 2023-12-04

- Change `querySelector`, `querySelectorAll` and `shadowRootQuerySelector` by the [shadow-dom-selector async dot notation](https://github.com/elchininet/shadow-dom-selector#buildasyncselector).

## [1.1.3] - 2023-11-20

- Do not bundle `shadow-dom-selector` inside the final bundle of `home-assistant-query-selector`
- Trigger the `onLovelacePanelLoad` event also when closing the raw configuration editor
- Improve the types when using the `detail` property of the `CustomEvent`


## [1.1.2] - 2023-11-20

- Fix typos in events prefixes

    * `onLovelaveMoreInfoDialogOpen` => `onLovelaceMoreInfoDialogOpen`
    * `onLovelaveHistoryAndLogBookDialogOpen` => `onLovelaceHistoryAndLogBookDialogOpen`
    * `onLovelaveSettingsDialogOpen` => `onLovelaceSettingsDialogOpen`

## [1.1.0] - 2023-11-19

- Add suport for three more events:

    * `onLovelaveMoreInfoDialogOpen` This event is triggered when a more-info dialog is open or when one returns to the main view of the more-info dialog from the `History` or `Settings` view inside the dialog.
    * `onLovelaveHistoryAndLogBookDialogOpen` This event is triggered when the `History` view is opened from the header actions of a more-info dialog.
    * `onLovelaveSettingsDialogOpen` This event is triggered when the `Settings` view is opened from the header actions of a more-info dialog.

## [1.0.0] - 2023-11-18

- Release of `home-assistant-query-selector`