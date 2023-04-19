/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { Value } from '../FormulaTypes';


import FormulaFunction from './FormulaFunction.js';
import FormulaTypes from '../FormulaTypes.js';
const { asNumber } = FormulaTypes;


/* *
 *
 *  Functions
 *
 * */


/**
 * Processor for the `SUM(...values)` implementation. Calculates the sum of the
 * given values.
 *
 * @private
 * @function Formula.ProcessorFunction.types.SUM
 *
 * @param {Array<(Highcharts.FormulaValue|Array<Highcharts.FormulaValue>)>} values
 * Values to process.
 *
 * @return {number}
 * Result value of the process.
 */
function process(
    values: Array<(Value|Array<Value>)>
): number {
    let result = 0;

    for (
        let i = 0,
            iEnd = values.length,
            value: (Value|Array<Value>);
        i < iEnd;
        ++i
    ) {
        value = values[i];

        if (value instanceof Array) {
            result += process(value);
        } else {
            result += asNumber(value);
        }
    }

    return result;
}


/* *
 *
 *  Registry
 *
 * */


const Sum: FormulaFunction = {
    process
};


FormulaFunction.registerType('SUM', Sum);


/* *
 *
 *  Default Export
 *
 * */


export default Sum;