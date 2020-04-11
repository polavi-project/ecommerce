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
        setFilters(prevFilters => prevFilters.concat({key: key, operator: operator, value: value}));
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
                return f;
            }));
    };

    const removeFilter = (key) => {
        const newFilters = filters.filter((f, index) => f.key !== key);
        setFilters(newFilters);
    };

    const cleanFilter = () => {
        setFilters(defaultFilter);
    };

    return <div className={"grid"}>
        <Area
            id={id}
            filters={filters}
            addFilter={addFilter}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
            cleanFilter={cleanFilter}
        />
    </div>
}