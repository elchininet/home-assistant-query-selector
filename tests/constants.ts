export const BASE_URL = 'http://host.docker.internal:8123';

export const SELECTORS = {
    HA_SIDEBAR: 'ha-sidebar',
    HEADER: '.header',
    HEADER_HISTORY: 'ha-top-app-bar-fixed',
    // Home Assistant 2025.2.x (remove when 2025.3.x is released)
    CLOSE_DIALOG_OLD: 'mwc-icon-button[title="Dismiss dialog"]',
    // Home Assistant > 2025.2.x
    CLOSE_DIALOG: 'mwc-icon-button[title="Close"]',
    ENTITY_CARD: 'hui-entities-card',
    DIALOG_HISTORY_BUTTON: 'mwc-icon-button[title="History"]',
    DIALOG_HISTORY_PANEL: 'ha-more-info-history-and-logbook',
    DIALOG_GO_BACK_BUTTON: 'ha-icon-button-prev[slot="navigationIcon"]',
    DIALOG_CONFIG_BUTTON: 'mwc-icon-button[title="Settings"]',
    DIALOG_SETTINGS_PANEL: 'ha-more-info-settings'
};
