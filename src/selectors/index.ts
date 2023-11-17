import { HomeAssistantNodeDescriptor } from '@types';
import {
    $,
    HA_ROOT_ELEMENT,
    HA_RESOLVER_ELEMENT
} from '@constants';

export enum QUERY_SELECTORS {
    HOME_ASSISTANT = 'home-assistant',
    HOME_ASSISTANT_MAIN = 'home-assistant-main',
    HA_DRAWER = 'ha-drawer',
    HA_SIDEBAR = 'ha-sidebar',
    PARTIAL_PANEL_RESOLVER = 'partial-panel-resolver',
    HA_PANEL_LOVELACE = 'ha-panel-lovelace',
    HUI_ROOT = 'hui-root',
    HEADER = '.header',
    HUI_VIEW = 'hui-view'
}

export const ROOT_SELECTORS: HomeAssistantNodeDescriptor = {
    [HA_ROOT_ELEMENT.HOME_ASSISTANT]: {
        selector: QUERY_SELECTORS.HOME_ASSISTANT,
        children: {
            shadowRoot: {
                selector: $,
                children: {
                    [HA_ROOT_ELEMENT.HOME_ASSISTANT_MAIN]: {
                        selector: QUERY_SELECTORS.HOME_ASSISTANT_MAIN,
                        children: {
                            shadowRoot: {
                                selector: $,
                                children: {
                                    [HA_ROOT_ELEMENT.HA_DRAWER]: {
                                        selector: QUERY_SELECTORS.HA_DRAWER,
                                        children: {
                                            [HA_ROOT_ELEMENT.HA_SIDEBAR]: {
                                                selector: QUERY_SELECTORS.HA_SIDEBAR,
                                                children: {
                                                    shadowRoot: {
                                                        selector: $
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const RESOLVER_SELECTORS: HomeAssistantNodeDescriptor = {
    [HA_RESOLVER_ELEMENT.PARTIAL_PANEL_RESOLVER]: {
        selector: QUERY_SELECTORS.PARTIAL_PANEL_RESOLVER,
        children: {
            [HA_RESOLVER_ELEMENT.HA_PANEL_LOVELACE]: {
                selector: QUERY_SELECTORS.HA_PANEL_LOVELACE,
                children: {
                    shadowRoot: {
                        selector: $,
                        children: {
                            [HA_RESOLVER_ELEMENT.HUI_ROOT]: {
                                selector: QUERY_SELECTORS.HUI_ROOT,
                                children: {
                                    shadowRoot: {
                                        selector: $,
                                        children: {
                                            [HA_RESOLVER_ELEMENT.HEADER]: {
                                                selector: QUERY_SELECTORS.HEADER,
                                            },
                                            [HA_RESOLVER_ELEMENT.HUI_VIEW]: {
                                                selector: QUERY_SELECTORS.HUI_VIEW
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};