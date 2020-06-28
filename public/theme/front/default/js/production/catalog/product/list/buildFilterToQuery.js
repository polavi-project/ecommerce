const buildFilterToQuery = (currentUrl, filters) => {
    let url = new URL(currentUrl);
    filters.forEach(f => {
        let value = f["value"];
        if (f.operator === "IN" && Array.isArray(value)) value = value.join(",");
        url.searchParams.set(f.key, value);
    });

    return url;
};

export { buildFilterToQuery };