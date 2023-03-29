/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from '../../Core/Options';
import type DataGrid from '../../DataGrid/DataGrid';

import Component from '../../Dashboards/Components/Component.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import U from '../../Core/Utilities.js';
const { createElement, merge, uniqueKey } = U;
import DataGridSyncHandlers from './DataGridSyncHandlers.js';

/* *
 *
 *  Class
 *
 * */

/**
 * DataGrid component for the Highcharts Dashboards.
 * @private
 * @class
 * @name Highcharts.DashboardComponent
 */
class DataGridComponent extends Component {

    /* *
     *
     *  Static Properties
     *
     * */

    public static syncHandlers = DataGridSyncHandlers;
    public static DataGridConstructor?: typeof DataGrid;
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            dataGridClassName: 'dataGrid-container',
            dataGridID: 'dataGrid-' + uniqueKey(),
            dataGridOptions: {},
            editableOptions: [],
            syncHandlers: DataGridSyncHandlers,
            onUpdate: DataGridComponent.onUpdate
        });

    /* *
     *
     *  Static Functions
     *
     * */

    public static onUpdate(
        e: KeyboardEvent,
        store: Component.ConnectorTypes
    ): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement) {
            const parentRow = inputElement
                .closest('.hc-dg-row');
            const cell = inputElement.closest('.hc-dg-cell');

            const converter = new DataConverter();

            if (
                parentRow &&
                parentRow instanceof HTMLElement &&
                cell &&
                cell instanceof HTMLElement
            ) {
                const dataTableRowIndex = parentRow
                    .dataset.rowIndex;
                const { columnName } = cell.dataset;

                if (
                    dataTableRowIndex !== void 0 &&
                    columnName !== void 0
                ) {
                    const table = store.table.modified;

                    if (table) {
                        let valueToSet = converter
                            .asGuessedType(inputElement.value);

                        if (valueToSet instanceof Date) {
                            valueToSet = valueToSet.toString();
                        }

                        table.setCell(
                            columnName,
                            parseInt(dataTableRowIndex, 10),
                            valueToSet
                        );
                    }
                }
            }
        }
    }

    public static fromJSON(
        json: DataGridComponent.ClassJSON
    ): DataGridComponent {
        const options = json.options;
        const dataGridOptions = JSON.parse(json.options.dataGridOptions || '');

        const component = new DataGridComponent(
            merge<DataGridComponent.ComponentOptions>(options as any, {
                dataGridOptions,
                syncHandlers: DataGridComponent.syncHandlers
            })
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    public dataGrid?: DataGrid;
    public dataGridContainer: HTMLElement;
    public dataGridOptions: Partial<Options>;
    public options: DataGridComponent.ComponentOptions;
    public sync: Component['sync'];

    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: Partial<DataGridComponent.ComponentOptions>) {
        options = merge(DataGridComponent.defaultOptions, options);

        super(options);

        this.options = options as DataGridComponent.ComponentOptions;
        this.type = 'DataGrid';
        this.dataGridContainer = createElement(
            'figure',
            void 0,
            void 0,
            void 0,
            true
        );

        if (this.options.dataGridClassName) {
            this.dataGridContainer.classList
                .add(this.options.dataGridClassName);
        }
        if (this.options.dataGridID) {
            this.dataGridContainer.id = this.options.dataGridID;
        }

        this.syncHandlers = this.handleSyncOptions(DataGridSyncHandlers);
        this.sync = new DataGridComponent.Sync(
            this,
            this.syncHandlers
        );

        this.dataGridOptions = this.options.dataGridOptions || ({} as any);

        if (this.connector) {
            // this.on('tableChanged', (): void => this.updateSeries());

            // Reload the store when polling.
            this.connector.on('afterLoad', (e: DataConnector.Event): void => {
                if (e.table && this.connector) {
                    this.connector.table.setColumns(e.table.getColumns());
                }
            });

            // Update the DataGrid when store changed.
            this.connector.table.on('afterSetCell', (e: any): void => {
                const dataGrid = this.dataGrid;
                let shouldUpdateTheGrid = true;

                if (dataGrid) {
                    const row = dataGrid.rowElements[e.rowIndex],
                        cells = Array.prototype.slice.call(row.childNodes);

                    cells.forEach((cell: HTMLElement): void => {
                        if (cell.childElementCount > 0) {
                            const input =
                                cell.childNodes[0] as HTMLInputElement,
                                convertedInputValue =
                                    typeof e.cellValue === 'string' ?
                                        input.value :
                                        +input.value;

                            if (cell.dataset.columnName === e.columnName &&
                                convertedInputValue === e.cellValue
                            ) {
                                shouldUpdateTheGrid = false;
                            }
                        }
                    });
                }

                shouldUpdateTheGrid ? this.update({}) : void 0;
            });
        }

        this.innerResizeTimeouts = [];

        // Add the component instance to the registry
        Component.addInstance(this);
    }

    /* *
     *
     *  Class methods
     *
     * */

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.contentElement.appendChild(this.dataGridContainer);
        this.hasLoaded = true;

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        this.emit({ type: 'beforeRender' });
        super.render();
        if (!this.dataGrid) {
            this.dataGrid = this.constructDataGrid();
        }
        this.sync.start();
        this.emit({ type: 'afterRender' });

        this.setupConnectorUpdate();

        return this;
    }

    public redraw(): this {
        super.redraw();
        return this.render();
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (this.dataGrid) {
            super.resize(width, height);
            this.dataGrid.setSize(width, height);
        }
    }

    public update(options: Partial<DataGridComponent.ComponentOptions>): this {
        super.update(options);
        if (this.dataGrid) {
            this.dataGrid.update(this.options.dataGridOptions || ({} as any));
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }

    private constructDataGrid(): DataGrid {
        if (DataGridComponent.DataGridConstructor) {
            this.dataGrid = new DataGridComponent.DataGridConstructor(
                this.dataGridContainer,
                {
                    ...this.options.dataGridOptions,
                    dataTable: this.connector && this.connector.table.modified
                }
            );
            return this.dataGrid;
        }

        throw new Error('DataGrid not connected.');
    }

    private setupConnectorUpdate(): void {
        const { connector: store, dataGrid } = this;

        if (store && dataGrid) {
            dataGrid.on<DataGrid.Event>('cellClick', (e): void => {
                if ('input' in e) {
                    e.input.addEventListener(
                        'keyup',
                        (keyEvent): void =>
                            this.options.onUpdate(keyEvent, store)
                    );
                }
            });
        }
    }

    public toJSON(): DataGridComponent.ClassJSON {
        const dataGridOptions = JSON.stringify(this.options.dataGridOptions);
        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                dataGridOptions
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridComponent {

    /* *
    *
    *  Declarations
    *
    * */

    /** @internal */
    export type ComponentType = DataGridComponent;

    /** @internal */
    export type ChartComponentEvents = JSONEvent | Component.EventTypes;

    /** @internal */
    export type JSONEvent = Component.Event<
    'toJSON' | 'fromJSON',
    {
        json: ClassJSON;
    }
    >;

    export interface ComponentOptions
        extends Component.ComponentOptions,
        EditableOptions {
        /**
         * The name of class that is applied to the data grid container.
         */
        dataGridClassName?: string;
        /**
         * The name of id that is applied to the data grid container.
         */
        dataGridID?: string;
        /** @internal */
        onUpdate: typeof DataGridComponent.onUpdate;
        type: 'DataGrid';
    }
    /** @internal */
    export interface EditableOptions extends Component.EditableOptions {
        dataGridOptions?: ComponentOptions;
        /**
         * The set of options like `dataGridClassName` and `dataGridID`.
         */
        /**
         * The name of class that is applied to the chart's container.
         */
        chartClassName?: string;
        /**
         * The id that is applied to the chart's container.
         */
        chartID?: string;
        /**
         * Names / aliases that should be mapped to xAxis values.
         * ```
         * Example
         * columnKeyMap: {
         *      'Food': 'x',
         *      'Vitamin A': 'y'
         * }
         * ```
         */
        columnKeyMap?: Record<string, string | null>;
    }
    /** @internal */
    export interface ComponentJSONOptions extends Component.ComponentOptionsJSON {
        dataGridOptions?: string;
        chartClassName?: string;
        chartID?: string;
    }
    /** @internal */
    export interface ClassJSON extends Component.JSON {
        options: ComponentJSONOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridComponent;