import {
    HAQuerySelectorConfig,
    HomeAssistantElement,
    HAElement
} from '@types';
import {
    DEFAULT_CONFIG,
    HA_ROOT_ELEMENT,
    HA_RESOLVER_ELEMENT,
    HA_DIALOG_ELEMENT,
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

class HAQuerySelector extends EventTarget {

    constructor(config: HAQuerySelectorConfig = {}) {
        super();
        this.#config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    #config: HAQuerySelectorConfig;
    #dialogTree: HomeAssistantElement;
    #homeAssistantRootTree: HomeAssistantElement;
    #homeAssistantResolverTree: HomeAssistantElement;
    #haDialogElements: Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>;
    #haRootElements: Record<keyof typeof HA_ROOT_ELEMENT, HAElement>;
    #haResolverElements: Record<keyof typeof HA_RESOLVER_ELEMENT, HAElement>;
    #dialogsObserver: MutationObserver;
    #dialogsContentObserver: MutationObserver;
    #panelResolverObserver: MutationObserver;
    #watchDialogsBinded: (mutations: MutationRecord[]) => void;
    #watchDialogsContentBinded: (mutations: MutationRecord[]) => void;
    #watchDashboardsBinded: (mutations: MutationRecord[]) => void;

    public listen() {

        this.#watchDialogsBinded = this.#watchDialogs.bind(this);
        this.#watchDialogsContentBinded = this.#watchDialogsContent.bind(this);
        this.#watchDashboardsBinded = this.#watchDashboards.bind(this);

        this.#dialogsObserver = new MutationObserver(this.#watchDialogsBinded);
        this.#dialogsContentObserver = new MutationObserver(this.#watchDialogsContentBinded);
        this.#panelResolverObserver = new MutationObserver(this.#watchDashboardsBinded);

        this.#updateRootElements();
        this.#updateResolverElements();
    }

    #dispatchEvent(type: HAQuerySelectorEvent, detail?: Record<string, HAElement>) {
        this.dispatchEvent(
            new CustomEvent(type, { detail })
        );
    }

    #updateDialogElements(
        dialogElement: (
            'HA_MORE_INFO_DIALOG_INFO' |
            'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK' |
            'HA_DIALOG_MORE_INFO_SETTINGS'
        ) = HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO
    ) {
        this.#dialogTree = getAsyncElements(
            this.#config,
            DIALOG_SELECTORS,
            this.#haRootElements.HOME_ASSISTANT.element
        );
        const haDialogElements = flatHomeAssistantTree<
            Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>
        >(
            HA_DIALOG_ELEMENT,
            this.#dialogTree
        );
        haDialogElements.HA_DIALOG_CONTENT
            .element
            .then((dialogContent: Element) => {
                this.#dialogsContentObserver?.disconnect();
                this.#dialogsContentObserver.observe(dialogContent, {
                    childList: true
                });
            });
        this.#haDialogElements = getFinalDialogFlatTree(
            haDialogElements,
            dialogElement
        );
        const MoreInfoDialogEventMapper = {
            [HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO]: HAQuerySelectorEvent.ON_LOVELACE_MORE_INFO_DIALOG_LOAD,
            [HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK]: HAQuerySelectorEvent.ON_LOVELACE_HISTORY_AND_LOGBOOK_DIALOG_LOAD,
            [HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_SETTINGS]: HAQuerySelectorEvent.ON_LOVELACE_SETTINGS_DIALOG_LOAD,
        } as const;
        this.#dispatchEvent(
            MoreInfoDialogEventMapper[dialogElement],
            this.#haDialogElements
        );
    }

    #updateRootElements() {
        this.#homeAssistantRootTree = getAsyncElements(
            this.#config,
            ROOT_SELECTORS
        );
        this.#haRootElements = flatHomeAssistantTree<
            Record<keyof typeof HA_ROOT_ELEMENT, HAElement>
        >(
            HA_ROOT_ELEMENT,
            this.#homeAssistantRootTree
        );
        this.#haRootElements[HA_ROOT_ELEMENT.HOME_ASSISTANT]
            .shadowRootQuerySelector('$')
            .then((shadowRoot: ShadowRoot): void => {
                this.#dialogsObserver?.disconnect();
                this.#dialogsObserver.observe(shadowRoot, {
                    childList: true
                });
            });
    }

    #updateResolverElements() {
        this.#homeAssistantResolverTree = getAsyncElements(
            this.#config,
            RESOLVER_SELECTORS,
            this.#haRootElements[HA_ROOT_ELEMENT.HA_DRAWER].element
        );
        this.#haResolverElements = flatHomeAssistantTree<
            Record<keyof typeof HA_RESOLVER_ELEMENT, HAElement>
        >(
            HA_RESOLVER_ELEMENT,
            this.#homeAssistantResolverTree
        );
        this.#haResolverElements[HA_RESOLVER_ELEMENT.PARTIAL_PANEL_RESOLVER]
            .element
            .then((partialPanelResolver: Element): void => {
                this.#panelResolverObserver?.disconnect();
                this.#panelResolverObserver.observe(partialPanelResolver, {
                    childList: true
                });
        });
        this.#dispatchEvent(
            HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
            {
                ...this.#haRootElements,
                ...this.#haResolverElements
            }
        );
    }

    #watchDialogs(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === QUERY_SELECTORS.HA_MORE_INFO_DIALOG) {
                    this.#updateDialogElements();
                }
            });
        });
    }

    #watchDialogsContent(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                const mappers = {
                    [QUERY_SELECTORS.HA_MORE_INFO_DIALOG_INFO]: HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG_INFO,
                    [QUERY_SELECTORS.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK]: HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK,
                    [QUERY_SELECTORS.HA_DIALOG_MORE_INFO_SETTINGS]: HA_DIALOG_ELEMENT.HA_DIALOG_MORE_INFO_SETTINGS,
                } as const;
                if (node.localName && node.localName in mappers) {
                    const dialogElementQuery = node.localName as keyof typeof mappers;
                    this.#updateDialogElements(mappers[dialogElementQuery]);
                }
            });
          });
    }

    #watchDashboards(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === QUERY_SELECTORS.HA_PANEL_LOVELACE) {
                    this.#updateResolverElements();
                }
            });
        });
    }

}

export {
    HAQuerySelector,
    HAQuerySelectorEvent,
    HomeAssistantElement
};