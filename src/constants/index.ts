export const $ = '$';

export const DEFAULT_CONFIG = {
    retries: 100,
    delay: 50
};

export enum HA_ROOT_ELEMENT {
    HOME_ASSISTANT = 'HOME_ASSISTANT',
    HOME_ASSISTANT_MAIN = 'HOME_ASSISTANT_MAIN',
    HA_DRAWER = 'HA_DRAWER',
    HA_SIDEBAR = 'HA_SIDEBAR'
}

export enum HA_RESOLVER_ELEMENT {
    PARTIAL_PANEL_RESOLVER = 'PARTIAL_PANEL_RESOLVER',
    HA_PANEL_LOVELACE = 'HA_PANEL_LOVELACE',
    HUI_ROOT = 'HUI_ROOT',
    HEADER = 'HEADER',
    HUI_VIEW = 'HUI_VIEW'
}

export enum HAQuerySelectorEvent {
    ON_LOVELACE_PANEL_LOAD = 'onLovelacePanelLoad'
}