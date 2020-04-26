const buildFilterToQuery = filters => {
    let filterStr = ``;

    for (let key in filters) {
        if (filters.hasOwnProperty(key)) {
            let value = filters[key].value;
            if (filters[key].operator == "IN" && Array.isArray(value)) value = value.join(", ");
            filterStr += `${key} : {operator : "${filters[key].operator}" value: "${value}"} `;
        }
    }
    filterStr = filterStr.trim();
    if (filterStr) filterStr = `(filter : {${filterStr}})`;

    return filterStr;
};

export { buildFilterToQuery };