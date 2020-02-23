var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { PaymentStatus } from "../edit/payment-status.js";
import { ShipmentStatus } from "../edit/shipment-status.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps, filters, updateFilter }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("id");else updateFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("order_id");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'id') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'id') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
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
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
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
                        className: "uk-input uk-form-small uk-form-width-small"
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

function NumberColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("order_number");else updateFilter("order_number", "=", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField('order_number');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'order_number') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
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
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Order number",
                    className: "uk-input uk-form-small uk-form-width-medium"
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

function TotalColumnHeader({ areaProps, filters, updateFilter }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("grand_total");else updateFilter("grand_total", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("grand_total");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'grand_total') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'grand_total') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "header price-header" },
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
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
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
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                )
            )
        )
    );
}

function TotalColumnRow({ row }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(_.get(row, "grand_total"));
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _grandTotal
        )
    );
}

function PaymentStatusColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onChange = e => {
        updateFilter("payment_status", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        areaProps.addField("payment_status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'payment_status') === -1 ? null : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header payment-status-header" },
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
                    {
                        ref: filterInput,
                        onChange: e => onChange(e),
                        className: "uk-select uk-form-small uk-form-width-small"
                    },
                    React.createElement(PaymentStatus, { noOuter: true })
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

function ShipmentStatusColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onChange = e => {
        updateFilter("shipment_status", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        areaProps.addField("shipment_status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'shipment_status') === -1 ? null : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header shipment-status-header" },
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
                React.createElement(
                    "select",
                    {
                        ref: filterInput,
                        onChange: e => onChange(e),
                        className: "uk-select uk-form-small uk-form-width-small"
                    },
                    React.createElement(ShipmentStatus, { noOuter: true })
                )
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

function OrderDateColumnHeader({ areaProps, filters, updateFilter }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("created_at");else updateFilter("created_at", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("created_at");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'created_at') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'created_at') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "header price-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Order date"
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
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
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
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                )
            )
        )
    );
}

function OrderDateColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _.get(row, "created_at")
        )
    );
}

function ActionColumnHeader({ areaProps, filters, updateFilter }) {
    React.useEffect(() => {
        areaProps.addField('order_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return React.createElement(
        "th",
        { className: "column" },
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
            ),
            React.createElement(
                "a",
                { onClick: () => onClick() },
                "Clean filter"
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

export default function OrderGrid({ apiUrl, areaProps }) {
    const [orders, setOrders] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.orderCollection.orders')) {
                setOrders(_.get(response, 'payload.data.orderCollection.orders'));
            }
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        areaProps.filters.forEach((f, i) => {
            filterStr += `${f.key} : {operator : "${f.operator}" value: "${f.value}"} `;
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
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "uk-overflow-auto" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-small uk-table-divider" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        className: "",
                        id: "order_grid_header",
                        filters: areaProps.filters,
                        addFilter: areaProps.addFilter,
                        updateFilter: areaProps.updateFilter,
                        removeFilter: areaProps.removeFilter,
                        cleanFilter: areaProps.cleanFilter,
                        addField: addField,
                        applyFilter: applyFilter,
                        noOuter: true,
                        coreWidgets: [{
                            component: IdColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 10,
                            id: "id"
                        }, {
                            component: NumberColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 20,
                            id: "number"
                        }, {
                            component: TotalColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 30,
                            id: "grand_total"
                        }, {
                            component: PaymentStatusColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 40,
                            id: "payment_status"
                        }, {
                            component: ShipmentStatusColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 50,
                            id: "shipment_status"
                        }, {
                            component: OrderDateColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 60,
                            id: "order_date"
                        }, {
                            component: ActionColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 70,
                            id: "action"
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                orders.map((o, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "order_grid_row",
                            row: o,
                            noOuter: true,
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
                                component: OrderDateColumnRow,
                                props: { row: o },
                                sort_order: 60,
                                id: "order_date"
                            }, {
                                component: ActionColumnRow,
                                props: { row: o },
                                sort_order: 70,
                                id: "action"
                            }]
                        })
                    );
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