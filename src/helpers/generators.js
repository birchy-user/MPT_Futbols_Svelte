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