import {
    HAQuerySelectorConfig,
    HomeAssistantElement,
    HAElement
} from '@types';
import {
    DEFAULT_CONFIG,
    HA_ROOT_ELEMENT,
    HA_RESOLVER_ELEMENT,
    HAQuerySelectorEvent
} from '@constants';
import {
    QUERY_SELECTORS,
    ROOT_SELECTORS,
    RESOLVER_SELECTORS
} from '@selectors';
import { getAsyncElements, flatHomeAssistantTree } from '@utilities';

class HAQuerySelector extends EventTarget {

    constructor(config: HAQuerySelectorConfig = {}) {
        super();
        this.#config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    #config: HAQuerySelectorConfig;
    #homeAssistantRootTree: HomeAssistantElement;
    #homeAssistantResolverTree: HomeAssistantElement;
    #haRootElements: Record<keyof typeof HA_ROOT_ELEMENT, HAElement>;
    #haResolverElements: Record<keyof typeof HA_RESOLVER_ELEMENT, HAElement>;
    #panelResolverObserver: MutationObserver;
    #watchDashboardsBinded: (mutations: MutationRecord[]) => void;

    public init() {
        this.#watchDashboardsBinded = this.#watchDashboards.bind(this);
        this.#updateRootElements();
        this.#updateResolverElements();
        this.#panelResolverObserver = new MutationObserver(this.#watchDashboardsBinded);
        this.#haResolverElements[HA_RESOLVER_ELEMENT.PARTIAL_PANEL_RESOLVER].element.then((partialPanelResolver: Element): void => {
            this.#panelResolverObserver.observe(partialPanelResolver, {
                childList: true
            });
        });
    }

    #dispatchEvent(type: HAQuerySelectorEvent, detail?: Record<string, HAElement>) {
        this.dispatchEvent(
            new CustomEvent(type, { detail })
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
        this.#dispatchEvent(
            HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
            this.#haRootElements
        );
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
        this.#dispatchEvent(
            HAQuerySelectorEvent.ON_LOVELACE_PANEL_CHANGE,
            {
                ...this.#haRootElements,
                ...this.#haResolverElements
            }
        );
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
    HAQuerySelectorEvent
};