import {
    HAQuerySelectorConfig,
    HomeAssistantNodeDescriptor,
    HomeAssistantElement,
    NodeDescriptorProps,
    ElementProps,
    HAElement
} from '@types';
import { $ } from '@constants';
import {
    asyncQuerySelector,
    asyncQuerySelectorAll,
    asyncShadowRootQuerySelector
} from 'shadow-dom-selector';

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

        const element: Promise<Element | null> = fromElement
            ? fromElement.then((element: Element | null) => {
                return asyncQuerySelector(
                    element,
                    getQuery(nodeDescriptor.selector, insideShadowRoot),
                    config
                );
            })
            : asyncQuerySelector(nodeDescriptor.selector, config);

        acc[key] = {
            element,
            children: getAsyncElements(
                config,
                nodeDescriptor.children,
                element
            ),
            async querySelector(selector: string, asyncProps: HAQuerySelectorConfig = {}) {
                const el = await element;
                return await asyncQuerySelector(
                    el,
                    selector,
                    {
                        ...config,
                        ...asyncProps
                    }
                );
            },
            async querySelectorAll(selector: string, asyncProps: HAQuerySelectorConfig = {}) {
                const el = await element;
                return await asyncQuerySelectorAll(
                    el,
                    selector,
                    {
                        ...config,
                        ...asyncProps
                    }
                );
            },
            async shadowRootQuerySelector(selector: string, asyncProps: HAQuerySelectorConfig = {}) {
                const el = await element;
                return await asyncShadowRootQuerySelector(
                    el,
                    selector,
                    {
                        ...config,
                        ...asyncProps
                    }
                );
            }
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