import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { PaymentStatus } from "../edit/payment-status.js";
import { ShipmentStatus } from "../edit/shipment-status.js";

function IdColumnHeader({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("order_id");
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "ID"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                        },
                        placeholder: "From"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);
                        },
                        placeholder: "To"
                    })
                )
            )
        )
    );
}

function IdColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            row.order_id
        )
    );
}

function NumberColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('order_number');
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header name-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Order number"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("orderNumber", "Equal", `%${e.target.value}%`);
                    },
                    placeholder: "Order number"
                })
            )
        )
    );
}

function NumberColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            "#",
            _.get(row, 'order_number', '')
        )
    );
}

function TotalColumnHeader({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("grand_total");
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Total"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("grand_total", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                        },
                        placeholder: "From"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("grand_total", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);
                        },
                        placeholder: "To"
                    })
                )
            )
        )
    );
}

function TotalColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _.get(row, "grand_total")
        )
    );
}

function PaymentStatusColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("payment_status");
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header status-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Payment status"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    { ref: filterInput, onChange: e => {
                            areaProps.addFilter("status", "Equal", e.target.value);
                        } },
                    React.createElement(
                        "option",
                        { value: 1 },
                        "Enabled"
                    ),
                    React.createElement(
                        "option",
                        { value: 0 },
                        "Disabled"
                    )
                )
            )
        )
    );
}

function PaymentStatusColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(PaymentStatus, { status: _.get(row, "payment_status") })
    );
}

function ShipmentStatusColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("shipment_status");
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header status-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Shipment status"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", { type: "text", ref: filterInput, onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("shipment_status", "Equal", e.target.value);
                    } })
            )
        )
    );
}

function ShipmentStatusColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(ShipmentStatus, { status: _.get(row, "shipment_status") })
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Action"
                )
            )
        )
    );
}

function ActionColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(A, { url: _.get(row, 'editUrl', ''), text: "Edit" })
    );
}

export default function OrderGrid({ apiUrl }) {
    const [orders, setOrders] = React.useState([]);
    const [filters, setFilters] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addFilter = (key, operator, value) => {
        let flag = 0;
        filters.forEach((f, i) => {
            if (f.key === key && !value) flag = 1; // Remove
            if (f.key === key && value) flag = 2; // Update
        });
        if (flag === 0) setFilters(prevFilters => prevFilters.concat({ key: key, operator: operator, value: value }));else if (flag === 1) {
            const setFilters = prevFilters.filter((f, index) => f.key !== key);
            setFilters(newFilters);
        } else setFilters(prevFilters => prevFilters.map((f, i) => {
            if (f.key === key) {
                f.operator = operator;
                f.value = value;
            }
            return f;
        }));
    };

    const cleanFilter = () => {
        setFilters([]);
    };
    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());
        axios({
            method: 'post',
            url: apiUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if (response.headers['content-type'] !== "application/json") throw new Error('Something wrong, please try again');
            if (_.get(response, 'data.payload.data.orderCollection.orders')) {
                setOrders(_.get(response, 'data.payload.data.orderCollection.orders'));
            }
        }).catch(function (error) {}).finally(function () {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        filters.forEach((f, i) => {
            filterStr += `${f.key} : {operator : ${f.operator} value: "${f.value}"} `;
        });
        filterStr = filterStr.trim();
        if (filterStr) filterStr = `(filter : {${filterStr}})`;

        let fieldStr = "";
        fields.forEach((f, i) => {
            fieldStr += `${f} `;
        });

        return `{orderCollection ${filterStr} {orders {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, filters]);

    return React.createElement(
        "div",
        { className: "uk-overflow-auto" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-small" },
            React.createElement(
                "thead",
                null,
                React.createElement(Area, {
                    className: "",
                    id: "order_grid_header",
                    addFilter: addFilter,
                    cleanFilter: cleanFilter,
                    addField: addField,
                    applyFilter: applyFilter,
                    reactcomponent: "tr",
                    coreWidgets: [{
                        component: IdColumnHeader,
                        props: { addFilter, cleanFilter, addField, applyFilter },
                        sort_order: 10,
                        id: "id"
                    }, {
                        component: NumberColumnHeader,
                        props: {},
                        sort_order: 20,
                        id: "number"
                    }, {
                        component: TotalColumnHeader,
                        props: {},
                        sort_order: 30,
                        id: "grand_total"
                    }, {
                        component: PaymentStatusColumnHeader,
                        props: {},
                        sort_order: 40,
                        id: "payment_status"
                    }, {
                        component: ShipmentStatusColumnHeader,
                        props: {},
                        sort_order: 50,
                        id: "shipment_status"
                    }, {
                        component: ActionColumnHeader,
                        props: {},
                        sort_order: 60,
                        id: "action"
                    }]
                })
            ),
            React.createElement(
                "tbody",
                null,
                orders.map((o, i) => {
                    return React.createElement(Area, {
                        key: i,
                        className: "",
                        id: "order_grid_row",
                        row: o,
                        reactcomponent: "tr",
                        coreWidgets: [{
                            component: IdColumnRow,
                            props: { row: o },
                            sort_order: 10,
                            id: "id"
                        }, {
                            component: NumberColumnRow,
                            props: { row: o },
                            sort_order: 20,
                            id: "number"
                        }, {
                            component: TotalColumnRow,
                            props: { row: o },
                            sort_order: 30,
                            id: "grand_total"
                        }, {
                            component: PaymentStatusColumnRow,
                            props: { row: o },
                            sort_order: 40,
                            id: "payment_status"
                        }, {
                            component: ShipmentStatusColumnRow,
                            props: { row: o },
                            sort_order: 50,
                            id: "shipment_status"
                        }, {
                            component: ActionColumnRow,
                            props: { row: o },
                            sort_order: 60,
                            id: "action"
                        }]
                    });
                })
            )
        ),
        orders.length === 0 && React.createElement(
            "div",
            null,
            "There is no order to display"
        )
    );
}