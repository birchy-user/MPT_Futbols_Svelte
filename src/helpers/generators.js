export function initializeEmptyObjectFromColumns(columns) {
    return columns.reduce((acc, column) => {
        acc = {
            ...acc,
            [column]: 0
        }

        return {...acc};
    }, {});
}

export function parseArrayOfJsonStrings(arrayOfJsonStrings) {
    let result = [];

    if (Array.isArray(arrayOfJsonStrings) && arrayOfJsonStrings.length > 0) {
        arrayOfJsonStrings.forEach((jsonData) => {
            let parsedOutput = JSON.parse(jsonData);
            result.push(parsedOutput);
        });
    }

    return result;
}

export function getParsedJsonData(jsonString) {
    return JSON.parse(jsonString);
}

export function parseArrayOrObjectDataByKeys(data, key) {
    let result = [];

    if (data !== undefined) {
        if (data.constructor.name == "Array") {
            data.forEach(value => {
                if (key) {
                    result.push(value[key]);   
                } else {
                    result.push(value);
                }
            });
        } else if (data.constructor.name == "Object") {
            if (key) {
                result.push(data[key]);
            } else {
                result.push(data);
            }
        }
    }

    return result;
}

/**
 * Atlasa pirmos n datus no saraksta.
 * 
 * @param {Object[]} data - datu saraksts
 * @param {Number} n - atgriežamo elementu skaits
 */
export function getFirstItemsByCount(data, n) {
    return data.splice(0, n);
}