import {
    HAQuerySelectorConfig,
    HomeAssistantElement,
    HAElement,
    ElementProps,
    HAQuerySelectorEventListener
} from '@types';
import {
    DEFAULT_CONFIG,
    HA_ROOT_ELEMENT,
    HA_RESOLVER_ELEMENT,
    HA_DIALOG_ELEMENT,
    TIMESTAMP_THESHOLD,
    HAQuerySelectorEvent
} from '@constants';
import {
    QUERY_SELECTORS,
    ROOT_SELECTORS,
    RESOLVER_SELECTORS,
    DIALOG_SELECTORS
} from '@selectors';
import {
    getAsyncElements,
    flatHomeAssistantTree,
    getFinalDialogFlatTree
} from '@utilities';

type OnLovelacePanelLoadDetail = Record<
    keyof typeof HA_ROOT_ELEMENT |
    keyof typeof HA_RESOLVER_ELEMENT,
    HAElement
>;

type OnLovelaceMoreInfoDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK' |
        'HA_DIALOG_MORE_INFO_SETTINGS'
    >,
    HAElement
>;

type OnLovelaceHistoryAndLogBookDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        'HA_MORE_INFO_DIALOG_INFO' |
        'HA_DIALOG_MORE_INFO_SETTINGS'
    >,
    HAElement
>;

type OnLovelaceSettingsDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        'HA_MORE_INFO_DIALOG_INFO' |
        'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK'
    >,
    HAElement
>;

class HAQuerySelector extends EventTarget {

    constructor(config: HAQuerySelectorConfig = {}) {
        super();
        this._config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    private _config: HAQuerySelectorConfig;

    private _dialogTree: HomeAssistantElement;
    private _homeAssistantRootTree: HomeAssistantElement;
    private _homeAssistantResolverTree: HomeAssistantElement;

    private _haDialogElements: Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>;
    private _haRootElements: Record<keyof typeof HA_ROOT_ELEMENT, HAElement>;
    private _haResolverElements: Record<keyof typeof HA_RESOLVER_ELEMENT, HAElement>;

    private _dialogsObserver: MutationObserver;
    private _dialogsContentObserver: MutationObserver;
    private _panelResolverObserver: MutationObserver;
    private _lovelaceObserver: MutationObserver;

    private _watchDialogsBinded: (mutations: MutationRecord[]) => void;
    private _watchDialogsContentBinded: (mutations: MutationRecord[]) => void;
    private _watchDashboardsBinded: (mutations: MutationRecord[]) => void;
    private _watchLovelaceBinded: (mutations: MutationRecord[]) => void;

    private _timestap: number;

    private _dispatchEvent(type: HAQuerySelectorEvent, detail?: Record<string, HAElement>) {
        this.dispatchEvent(
            new CustomEvent(type, { detail })
        );
    }

    private _updateDialogElements(
        dialogElement: (
            'HA_MORE_INFO_DIALOG_INFO' |
            'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK' |
            'HA_DIALOG_MORE_INFO_SETTINGS'
        ) = HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO
    ) {
        this._dialogTree = getAsyncElements(
            this._config,
            DIALOG_SELECTORS,
            this._haRootElements.HOME_ASSISTANT.element
        );
        const haDialogElements = flatHomeAssistantTree<
            Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>
        >(
            HA_DIALOG_ELEMENT,
            this._dialogTree
        );
        haDialogElements.HA_DIALOG_CONTENT
            .element
            .then((dialogContent: Element) => {
                this._dialogsContentObserver.disconnect();
                this._dialogsContentObserver.observe(dialogContent, {
                    childList: true
                });
            });
        this._haDialogElements = getFinalDialogFlatTree(
            haDialogElements,
            dialogElement
        );
        const MoreInfoDialogEventMapper = {
            [HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO]: HAQuerySelectorEvent.ON_LOVELACE_MORE_INFO_DIALOG_OPEN,
            [HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK]: HAQuerySelectorEvent.ON_LOVELACE_HISTORY_AND_LOGBOOK_DIALOG_OPEN,
            [HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_SETTINGS]: HAQuerySelectorEvent.ON_LOVELACE_SETTINGS_DIALOG_OPEN,
        } as const;
        this._dispatchEvent(
            MoreInfoDialogEventMapper[dialogElement],
            this._haDialogElements
        );
    }

    private _updateRootElements() {
        this._homeAssistantRootTree = getAsyncElements(
            this._config,
            ROOT_SELECTORS
        );
        this._haRootElements = flatHomeAssistantTree<
            Record<keyof typeof HA_ROOT_ELEMENT, HAElement>
        >(
            HA_ROOT_ELEMENT,
            this._homeAssistantRootTree
        );
        this._haRootElements[HA_ROOT_ELEMENT.HOME_ASSISTANT]
            .selector.$.element
            .then((shadowRoot: ShadowRoot): void => {
                this._dialogsObserver.disconnect();
                this._dialogsObserver.observe(shadowRoot, {
                    childList: true
                });
            });
    }

    private _updateResolverElements() {
        // Avoid triggering onLovelacePanelLoad twice on yaml mode
        const timestamp = Date.now();
        if (timestamp - this._timestap < TIMESTAMP_THESHOLD) {
            return;
        }
        this._timestap = timestamp;
        this._homeAssistantResolverTree = getAsyncElements(
            this._config,
            RESOLVER_SELECTORS,
            this._haRootElements[HA_ROOT_ELEMENT.HA_DRAWER].element
        );
        this._haResolverElements = flatHomeAssistantTree<
            Record<keyof typeof HA_RESOLVER_ELEMENT, HAElement>
        >(
            HA_RESOLVER_ELEMENT,
            this._homeAssistantResolverTree
        );
        this._haResolverElements[HA_RESOLVER_ELEMENT.PARTIAL_PANEL_RESOLVER]
            .element
            .then((partialPanelResolver: Element): void => {
                this._panelResolverObserver.disconnect();
                this._panelResolverObserver.observe(partialPanelResolver, {
                    childList: true
                });
        });
        this._haResolverElements[HA_RESOLVER_ELEMENT.HA_PANEL_LOVELACE]
            .selector.$.element
            .then((lovelaceShadowRoot: ShadowRoot) => {
                this._lovelaceObserver.disconnect();
                this._lovelaceObserver.observe(lovelaceShadowRoot, {
                    childList: true
                });
            });
        this._dispatchEvent(
            HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
            {
                ...this._haRootElements,
                ...this._haResolverElements
            }
        );
    }

    private _watchDialogs(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === QUERY_SELECTORS.HA_MORE_INFO_DIALOG) {
                    this._updateDialogElements();
                }
            });
        });
    }

    private _watchDialogsContent(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                const mappers = {
                    [QUERY_SELECTORS.HA_MORE_INFO_DIALOG_INFO]: HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO,
                    [QUERY_SELECTORS.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK]: HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK,
                    [QUERY_SELECTORS.HA_DIALOG_MORE_INFO_SETTINGS]: HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_SETTINGS,
                } as const;
                if (node.localName && node.localName in mappers) {
                    const dialogElementQuery = node.localName as keyof typeof mappers;
                    this._updateDialogElements(mappers[dialogElementQuery]);
                }
            });
          });
    }

    private _watchDashboards(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === QUERY_SELECTORS.HA_PANEL_LOVELACE) {
                    this._updateResolverElements();
                }
            });
        });
    }

    private _watchLovelace(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === QUERY_SELECTORS.HUI_ROOT) {
                    this._updateResolverElements();
                }
            });
        });
    }

    public listen() {

        this._watchDialogsBinded = this._watchDialogs.bind(this);
        this._watchDialogsContentBinded = this._watchDialogsContent.bind(this);
        this._watchDashboardsBinded = this._watchDashboards.bind(this);
        this._watchLovelaceBinded = this._watchLovelace.bind(this);

        this._dialogsObserver = new MutationObserver(this._watchDialogsBinded);
        this._dialogsContentObserver = new MutationObserver(this._watchDialogsContentBinded);
        this._panelResolverObserver = new MutationObserver(this._watchDashboardsBinded);
        this._lovelaceObserver = new MutationObserver(this._watchLovelaceBinded);

        this._updateRootElements();
        this._updateResolverElements();
    }
    
    public override addEventListener(
        type: `${HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD}`,
        callback: HAQuerySelectorEventListener<
            OnLovelacePanelLoadDetail
        >,
        options?: boolean | AddEventListenerOptions
    ): void;
    public override addEventListener(
        type: `${HAQuerySelectorEvent.ON_LOVELACE_MORE_INFO_DIALOG_OPEN}`,
        callback: HAQuerySelectorEventListener<
            OnLovelaceMoreInfoDialogOpenDetail
        >,
        options?: boolean | AddEventListenerOptions
    ): void;
    public override addEventListener(
        type: `${HAQuerySelectorEvent.ON_LOVELACE_HISTORY_AND_LOGBOOK_DIALOG_OPEN}`,
        callback: HAQuerySelectorEventListener<
            OnLovelaceHistoryAndLogBookDialogOpenDetail
        >,
        options?: boolean | AddEventListenerOptions
    ): void;
    public override addEventListener(
        type: `${HAQuerySelectorEvent.ON_LOVELACE_SETTINGS_DIALOG_OPEN}`,
        callback: HAQuerySelectorEventListener<
            OnLovelaceSettingsDialogOpenDetail
        >,
        options?: boolean | AddEventListenerOptions
    ): void;
    public override addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        super.addEventListener(type, callback, options);
    }

}

export {
    HAQuerySelector,
    HAQuerySelectorEvent,
    ElementProps,
    OnLovelacePanelLoadDetail,
    OnLovelaceMoreInfoDialogOpenDetail,
    OnLovelaceHistoryAndLogBookDialogOpenDetail,
    OnLovelaceSettingsDialogOpenDetail
};