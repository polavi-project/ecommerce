export default function SoldQuantityColumnHeader({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") areaProps.removeFilter("sold_qty");else areaProps.updateFilter("sold_qty", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("sold_qty");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = areaProps.filters.findIndex(e => e.key === 'sold_qty') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = areaProps.filters.findIndex(e => e.key === 'sold_qty') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "table-header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Sold qty"
                )
            ),
            React.createElement(
                "div",
                { className: "filter range" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "form-control"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "To",
                        className: "form-control"
                    })
                )
            )
        )
    );
}