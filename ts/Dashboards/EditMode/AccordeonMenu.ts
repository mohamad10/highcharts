import type Component from '../Components/Component.js';
import type EditableOptions from '../Components/EditableOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
const {
    createElement
} = U;


class AccordeonMenu {
    private iconsURLPrefix: string;
    private closeSidebar: Function;
    private changedOptions: DeepPartial<Component.ComponentOptions> = {};

    constructor(iconsURLPrefix: string, closeSidebar: Function) {
        this.iconsURLPrefix = iconsURLPrefix;
        this.closeSidebar = closeSidebar;
    }

    public updateOptions(
        propertyPath: Array<string>,
        value: boolean | string | number
    ): void {
        let currentLevel = this.changedOptions as any;
        const pathLength = propertyPath.length - 1;

        for (let i = 0; i < pathLength; i++) {
            const key = propertyPath[i];

            if (!currentLevel[key]) {
                currentLevel[key] = {};
            }

            currentLevel = currentLevel[key];
        }

        currentLevel[propertyPath[pathLength]] = value;
    }

    public renderContent(container: HTMLElement, component: Component): void {
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let option, content;

        const accordeonContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordeonMenu
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapse(
                accordeonContainer,
                option.name
            ).content;

            this.renderAccordeon(option, content, component);
        }

        EditRenderer.renderButton(
            accordeonContainer,
            {
                value: EditGlobals.lang.confirmButton,
                callback: (): void => {
                    component.update(this.changedOptions as any);
                    menu.closeSidebar();
                }
            }
        );

        EditRenderer.renderButton(
            accordeonContainer,
            {
                value: EditGlobals.lang.cancelButton,
                callback: (): void => {
                    menu.changedOptions = {};
                    menu.closeSidebar();
                }
            }
        );
    }

    public renderAccordeon(
        option: EditableOptions.Configuration,
        parentNode: HTMLElement,
        component: Component
    ): void {

        if (option.type === 'nested') {
            return this.renderNested(parentNode, option, component);
        }

        const renderFunction = EditRenderer.getRendererFunction(option.type);


        if (!renderFunction) {
            return;
        }
        renderFunction(parentNode, {
            ...option,
            iconsURLPrefix: this.iconsURLPrefix,
            value: this.getValue(component, option.propertyPath),
            onchange: (
                value: boolean | string | number
            ): void => this.updateOptions(option.propertyPath || [], value)
        });

    }

    public renderNested(
        parentElement: HTMLElement,
        options: EditableOptions.Configuration,
        component: Component
    ): void {
        if (!parentElement || !options.detailedOptions) {
            return;
        }

        const detailedOptions = options.detailedOptions;

        for (let i = 0, iEnd = detailedOptions.length; i < iEnd; ++i) {
            const name = detailedOptions[i].name;
            const nestedOptions = detailedOptions[i].options;
            const allowEnabled = detailedOptions[i].allowEnabled;
            const content = EditRenderer.renderNestedHeaders(
                parentElement,
                name,
                !!allowEnabled
            );

            for (let j = 0, jEnd = nestedOptions.length; j < jEnd; ++j) {
                this.renderAccordeon(
                    nestedOptions[j] as any,
                    content,
                    component
                );
            }

        }
        return;
    }
    public getValue(
        component: Component,
        propertyPath?: Array<string>
    ): number | string | boolean | undefined {
        if (!propertyPath) {
            return;
        }

        if (propertyPath.length === 1 && propertyPath[0] === 'chartOptions') {
            return JSON.stringify(component.options.chartOptions, null, 2);
        }

        let value = component.options as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (!value) {
                return;
            }
            value = value[propertyPath[i]];
        }
        return value;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default AccordeonMenu;
