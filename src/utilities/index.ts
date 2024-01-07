import {
    HAQuerySelectorConfig,
    HomeAssistantNodeDescriptor,
    HomeAssistantElement,
    NodeDescriptorProps,
    ElementProps,
    HAElement
} from '@types';
import { $, HA_DIALOG_ELEMENT } from '@constants';
import { AsyncSelector, asyncQuerySelector } from 'shadow-dom-selector';

const getQuery = (selector: string, shadowRoot: boolean) => shadowRoot
    ? $ + ' ' + selector
    : selector;

export const getAsyncElements = (
    config: HAQuerySelectorConfig,
    node: HomeAssistantNodeDescriptor,
    fromElement: Promise<Element> = null,
    insideShadowRoot = false,
): HomeAssistantElement => {

    const entries = Object.entries(node || {});

    return entries.reduce((acc: HomeAssistantElement, entry: [string, NodeDescriptorProps]): HomeAssistantElement => {

        const [key, nodeDescriptor] = entry;

        if (
            nodeDescriptor.selector === $ &&
            fromElement
        ) {

            return nodeDescriptor.children
                ? {
                    ...acc,
                    ...getAsyncElements(
                        config,
                        nodeDescriptor.children,
                        fromElement,
                        true
                    )
                }
                : acc;

        }

        const element: Promise<Element> = fromElement
            ? fromElement.then((element: Element | null) => {
                if (element) {
                    return asyncQuerySelector(
                        element,
                        getQuery(nodeDescriptor.selector, insideShadowRoot),
                        config
                    );
                }
                return null;
            })
            : asyncQuerySelector(nodeDescriptor.selector, config);

        acc[key] = {
            element,
            children: getAsyncElements(
                config,
                nodeDescriptor.children,
                element
            ),
            selector: new AsyncSelector(
                element,
                config
            )
        };

        return acc;

    }, {} as HomeAssistantElement);

};

export const searchNode = (
    key: string,
    node: HomeAssistantElement
): ElementProps => {
    const entries = Object.entries(node) as [string, ElementProps][];
    for (const entry of entries) {
        if (entry[0] === key) {
            return entry[1];
        } else {
            const noeDeep = searchNode(key, entry[1].children);
            if (noeDeep) {
                return noeDeep;
            }
        }
    }
};

export const flatHomeAssistantTree = <T extends object>(
    rootElement: object,
    tree: HomeAssistantElement
): T => {
    const rootElementKeys = Object.keys(rootElement);
    return rootElementKeys.reduce(
        (acc: Record<string, HAElement>, key: string): Record<string, HAElement> => {
            const node = searchNode(key, tree);
            const { children, ...rest } = node;
            acc[key] = {
                ...rest
            };
            return acc;
        },
        {} as Record<string, HAElement>
    ) as T;
};

export const getFinalDialogFlatTree = (
    flatTree: Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>,
    dialogElement: (
        'HA_MORE_INFO_DIALOG_INFO' |
        'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK' |
        'HA_DIALOG_MORE_INFO_SETTINGS'
    )
): Record<keyof typeof HA_DIALOG_ELEMENT, HAElement> => {
    const extractKeys = [
        HA_DIALOG_ELEMENT.HA_MORE_INFO_DIALOG,
        HA_DIALOG_ELEMENT.HA_DIALOG,
        HA_DIALOG_ELEMENT.HA_DIALOG_CONTENT,
        dialogElement
    ];
    const reducer = (
        tree: Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>,
        key: keyof typeof HA_DIALOG_ELEMENT
    ): Record<keyof typeof HA_DIALOG_ELEMENT, HAElement> => {
        tree[key] = flatTree[key];
        return tree;
    };
    return extractKeys.reduce(
        reducer,
        {} as Record<keyof typeof HA_DIALOG_ELEMENT, HAElement>
    );
};