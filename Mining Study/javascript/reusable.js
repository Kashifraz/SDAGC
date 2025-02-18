import _ from "lodash";
import { checkDataType } from "./refactored/checkDataType";


/**
 * @param  {[String]} strArr ['hello','-','world']
 * @param  {[{Object}]} separator ' '(default)
 * @returns {String} 'hello - world'
 */
export function concatStringsWith(strArr = [], separator = ' ') {
    return strArr.join(separator).trim();
}


// Input: 'helloThereMister'
// Output: 'Hello There Mister'
export function toSentenceCase(ccString) {
    return _.startCase(ccString);
}

// Input: 'Hello There Mister'
// Output: 'helloThereMister'
export function toCamelCase(inputString) {
    if (inputString === undefined) return inputString; // if false value
    return _.camelCase(inputString);
    // return inputString.trim().toLowerCase().replace(/\s+/g, '')
}



// returns a deep copy of object
export function deepClone(item /* = 'no value provided in deepClone()' */) {
    { //? The Performance expensive version
        // if (!original) console.error('original not found', original);
        // if (!original) return false;
        // return JSON.parse(JSON.stringify(original))
    }
    return _.cloneDeep(item)
}


// Input: {label1: 'value1'} (parent Obj), ['label2', 'value2'] (entry Pair Arr)
// Output: {label1: 'value1', label2: 'value2'}
export function addObjectPair(parentObj, entryPairArr) {
    const newParent = deepClone(parentObj);
    newParent[`${entryPairArr[0]}`] = entryPairArr[1]
    return newParent;
}


// Input: {label1: 'value1', label2: 'value2'}
// Output-phase1: [ 
//   ['label1': 'name'],
//   ['label2': 'John Doe']
//  ]
// Output-phase2: [
//   {
//     label: "label1",
//     value: "name"
// },
// {
//     label: "label2",
//     value: "John Doe"
// }
// ]
// performs transformation on each object-pair and returns an array.
export function transformEntries(object, transformer = pairToEntry) {
    return Object.entries(object).map((el, idx) => {
        return transformer(el, idx)
    });
}
// returns transformed data from an array
export function transformArray(array, transformer) {
    return array.map((el, idx) => {
        return transformer(el, idx)
    });
}

export function isObjEmpty(obj) {
    return obj && // is it defined
        Object.entries(obj).length === 0 || // entries exists ?
        Object.values(obj).every( // check all attributes for the following checks
            attribute => (
                // Checks for attributes
                attribute === null ||
                attribute === undefined ||
                attribute === ''
                // || attribute === false // optional
            )
        )
}


// Input: ['label1', 'value1']
// Input: {label1: 'value1'}
function pairToEntry(pairArr, pairIndex) {
    return Object.fromEntries(pairArr)

}

export function genLog(label, data, background = '#78f086', padding = '0.5rem 1rem', color = '#000') {
    console.log(`%c ${label}`, `background: ${background}; padding: ${padding}; color: ${color}`, data);
}



export function replaceLastCharacter(char, replacement, replaceLength = 1) {
    return (char.toString()).slice(0, -replaceLength) + replacement;
};

export function genErrMsg(message) {
    throw new Error(message)
}


// check if a string is non-empty and not undefined or null and capitalize the first letter
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// check if a string is non-empty and not undefined or null and de-capitalize the first letter
export function deCapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}



export function equateCase(a, b) {
    return a.toLowerCase() === b.toLowerCase()
}

// Created by Github Copilot
// create a function to format a number to 3 digits with leading zeros
export function setDigits(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}



// Sequence generator function (commonly referred to as "range")
export const range = (start, stop, step = 1) => Array.from(
    { length: (stop - start) / step + 1 }, // *defining the length property of the Array as Array is a special object with a length property equal to number of elements in the array
    (_, i) => start + (i * step)
);


function isString(val) {
    return checkDataType(val) === 'string'
}

function isNumber(val) {
    return checkDataType(val) === 'number'
}

export function isArray(val) {
    return checkDataType(val) === 'array'
}

export function isEmptyArray(val) {
    return checkDataType(val) === 'array' && val.length === 0
}

export function isObject(val) {
    return checkDataType(val) === 'object'
}

export function isArrayOfStrings(val) {
    if (isArray(val) && val.every(arrayItem => isString(arrayItem))) return true
    return false
}

export function isArrayOfNumbers(val) {
    if (isArray(val) && val.every(arrayItem => isNumber(arrayItem))) return true
    return false
}
export function isArrayOfObjects(val) {
    if (isArray(val) && val.every(arrayItem => isObject(arrayItem))) return true
    return false;
}


export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export function badRequest(requestMessage) {
    return res.status(200).json({
        success: false,
        message: requestMessage,
        data: null,
        error: requestMessage
    })
}

// generate a next fetcher
export const fetcher = (...args) => fetch(...args).then(res => res.json())

export function renderRawData(data) {
    return <pre>
        {JSON.stringify(data, null, 2)}
    </pre>;
}