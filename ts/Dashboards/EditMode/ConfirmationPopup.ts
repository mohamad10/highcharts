/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import U from '../../Core/Utilities.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import BaseForm from '../../Shared/BaseForm.js';
import EditGlobals from './EditGlobals.js';
import EditRenderer from './EditRenderer.js';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';
import EditMode from './EditMode.js';

const {
    createElement
} = U;

class ConfirmationPopup extends BaseForm {
    /* *
    *
    *  Static Properties
    *
    * */

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        parentDiv: HTMLElement,
        iconsURL: string,
        editMode: EditMode,
        options: ConfirmationPopup.Options
    ) {
        super(parentDiv, iconsURL);

        this.editMode = editMode;
        this.options = options;
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: ConfirmationPopup.Options;
    public contentContainer: HTMLDOMElement|undefined;
    public editMode: EditMode;

    /* *
    *
    *  Functions
    *
    * */

    protected createPopupContainer(
        parentDiv: HTMLElement,
        className: string = EditGlobals.classNames.confirmationPopup
    ): HTMLElement {
        return super.createPopupContainer(parentDiv, className);
    }

    protected addCloseButton(
        className: string = EditGlobals.classNames.popupCloseButton
    ): HTMLElement {
        return super.addCloseButton(className);
    }

    public renderContent(
        options: ConfirmationPopup.ContentOptions
    ): void {
        // render content wrapper
        this.contentContainer = createElement(
            'div', {
                className: EditGlobals.classNames.popupContentContainer
            }, {},
            this.container
        );

        const popupContainer = this.contentContainer.parentNode;
        popupContainer.style.marginTop = '0px';
        const offsetTop = popupContainer.getBoundingClientRect().top;

        popupContainer.style.marginTop = (
            offsetTop < 0 ? Math.abs(offsetTop - 200) : 200
        ) + 'px';

        // render text
        EditRenderer.renderText(this.contentContainer, {
            title: options.text || ''
        });

        // render buttons
        // Cancel
        EditRenderer.renderButton(
            this.contentContainer,
            {
                value: options.cancelButton.value,
                callback: options.cancelButton.callback
            }
        );

        // Confirm
        EditRenderer.renderButton(
            this.contentContainer,
            {
                value: options.confirmButton.value,
                className: EditGlobals.classNames.popupConfirmBtn,
                callback: (): void => {
                    // run callback
                    // confirmCallback.call(context);
                    options.confirmButton.callback.call(
                        options.confirmButton.context
                    );
                    // hide popup
                    this.closePopup();
                }
            }
        );
    }

    public show(
        options: ConfirmationPopup.ContentOptions
    ): void {
        this.showPopup();
        this.renderContent(options);
        this.editMode.setEditOverlay();
    }

    public closePopup(): void {
        super.closePopup();
        this.editMode.setEditOverlay(true);
    }
}

namespace ConfirmationPopup {
    export interface Options {
        close: CloseIcon;
    }

    export interface CloseIcon {
        icon: string;
    }

    export interface ContentOptions {
        confirmButton: ConfirmButton;
        cancelButton: ConfirmButton;
        text: string;
    }

    export interface ConfirmButton {
        value: string;
        callback: Function;
        context: RowEditToolbar|CellEditToolbar;
    }

    export interface CancelButton{
        value: string;
        callback: Function;
    }
}

export default ConfirmationPopup;
