import Area from "../area.js";

export default function Grid({id, defaultFilter = []})
{
    const [filters, setFilters] = React.useState(() => {
        if(defaultFilter !== undefined)
            return defaultFilter;
        else
            return [];
    });

    const addFilter = (key, operator, value) => {
        let newFilters = filters.concat({key: key, operator: operator, value: value});
        if(key != 'page')
            newFilters = newFilters.filter((f, index) => f.key !== 'page');
        setFilters(newFilters);
    };

    const updateFilter = (key, operator, value) => {
        if(filters.findIndex((e) => e.key === key) === -1)
            addFilter(key, operator, value);
        else
            setFilters(prevFilters => prevFilters.map((f, i) => {
                if(f.key === key) {
                    f.operator = operator;
                    f.value = value;
                }

                if(f.key === 'page' && key != 'page') {
                    f.operator = operator;
                    f.value = 1;
                }

                return f;
            }));
    };

    const removeFilter = (key) => {
        const newFilters = filters.filter((f, index) => f.key !== key && f.key !== 'page');
        setFilters(newFilters);
    };

    const cleanFilter = () => {
        setFilters(defaultFilter);
    };

    return <Area
        id={id}
        filters={filters}
        addFilter={addFilter}
        updateFilter={updateFilter}
        removeFilter={removeFilter}
        cleanFilter={cleanFilter}
        className={"grid sml-block"}
    />
}