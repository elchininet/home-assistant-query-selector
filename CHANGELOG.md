# Changelog

## [5.0.0] - xxx

- Make the library compatible with Home Assistant `2026.3.x`

## [4.3.0] - 2024-11-10

- Update `shadow-dom-selector` to its latest version

## [4.2.0] - 2024-01-13

- Make the event threshold a property that can be sent by the clients instead a constant. With this change the event threshold has been changed from `50` to `450`.

## [4.1.0] - 2024-01-09

- Do not allow any event to be dispatched more than once in a short timestamp

## [4.0.0] - 2024-01-04

- Breaking change: refactored the event names and created a new event (an event that will be triggered if any panel is loaded not only a lovelace panel)

## [3.0.0] - 2024-01-02

- Breaking change: Removed "lovelace" string from all the events because these events can be triggered on any dashboard if the `listen` method is called. The new even names are:
    * ON_PANEL_LOAD (`onPanelLoad`)
    * ON_MORE_INFO_DIALOG_OPEN (`onMoreInfoDialogOpen`)
    * ON_HISTORY_AND_LOGBOOK_DIALOG_OPEN (`onHistoryAndLogBookDialogOpen`)
    * ON_SETTINGS_DIALOG_OPEN (`onSettingsDialogOpen`)
- Fix a bug: if one of the elements in a tree is null, return null instead of trying to perform a query on a null element which will throw an error

## [2.1.5] - 2023-12-19

- Publish the package using npm provenance

## [2.1.4] - 2023-12-16

- Update the `shadow-dom-selector` package to the latest version

## [2.1.3] - 2023-12-15

- Update the `shadow-dom-selector` package to the latest version to make it possible to use the new `deepQuery` method

## [2.1.2] - 2023-12-13

- Remove private class properties

## [2.1.1] - 2023-12-05

- Export all the `CustomEvents` details object to be able to use them for type checking in the clients

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