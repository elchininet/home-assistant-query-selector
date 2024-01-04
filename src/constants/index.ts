export const $ = '$';

export const TIMESTAMP_THESHOLD = 500;

export const DEFAULT_CONFIG = {
    retries: 100,
    delay: 50
};

export enum HA_ROOT_ELEMENT {
    HOME_ASSISTANT = 'HOME_ASSISTANT',
    HOME_ASSISTANT_MAIN = 'HOME_ASSISTANT_MAIN',
    HA_DRAWER = 'HA_DRAWER',
    HA_SIDEBAR = 'HA_SIDEBAR',
    PARTIAL_PANEL_RESOLVER = 'PARTIAL_PANEL_RESOLVER',
}

export enum HA_LOVELACE_ELEMENT {
    HA_PANEL_LOVELACE = 'HA_PANEL_LOVELACE',
    HUI_ROOT = 'HUI_ROOT',
    HEADER = 'HEADER',
    HUI_VIEW = 'HUI_VIEW'
}

export enum HA_DIALOG_ELEMENT {
    HA_MORE_INFO_DIALOG = 'HA_MORE_INFO_DIALOG',
    HA_DIALOG = 'HA_DIALOG',
    HA_DIALOG_CONTENT = 'HA_DIALOG_CONTENT',
    HA_MORE_INFO_DIALOG_INFO = 'HA_MORE_INFO_DIALOG_INFO',
    HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK = 'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK',
    HA_DIALOG_MORE_INFO_SETTINGS = 'HA_DIALOG_MORE_INFO_SETTINGS'

}

export enum HAQuerySelectorEvent {
    ON_LISTEN = 'onListen',
    ON_PANEL_LOAD = 'onPanelLoad',
    ON_LOVELACE_PANEL_LOAD = 'onLovelacePanelLoad',
    ON_MORE_INFO_DIALOG_OPEN = 'onMoreInfoDialogOpen',
    ON_HISTORY_AND_LOGBOOK_DIALOG_OPEN = 'onHistoryAndLogBookDialogOpen',
    ON_SETTINGS_DIALOG_OPEN = 'onSettingsDialogOpen'
}