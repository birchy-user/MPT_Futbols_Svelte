export function initializeEmptyObjectFromColumns(columns) {
    return columns.reduce((acc, column) => {
        acc = {
            ...acc,
            [column]: 0
        }

        return {...acc};
    }, {});
}