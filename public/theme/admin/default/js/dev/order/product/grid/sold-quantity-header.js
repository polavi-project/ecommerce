export default function SoldQuantityColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                areaProps.removeFilter("sold_qty");
            else
                areaProps.updateFilter("sold_qty", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("sold_qty");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = areaProps.filters.findIndex((e)=> e.key === 'sold_qty') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = areaProps.filters.findIndex((e)=> e.key === 'sold_qty') === -1 ? "" : filterTo.current.value;
    });

    return <th className={"column"}>
        <div className="table-header id-header">
            <div className={"title"}><span>Sold qty</span></div>
            <div className={"filter range"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="form-control"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="form-control"
                    />
                </div>
            </div>
        </div>
    </th>
}