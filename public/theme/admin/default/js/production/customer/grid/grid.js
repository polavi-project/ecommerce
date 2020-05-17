var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("customer_id");
    }, []);

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "table-header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "ID"
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
            row.customer_id
        )
    );
}

function EmailColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('email');
    }, []);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("email");else updateFilter("email", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'email') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "table-header name-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Email"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Email",
                    className: "form-control"
                })
            )
        )
    );
}

function EmailColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _.get(row, 'email', '')
        )
    );
}

function NameColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('full_name');
    }, []);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("full_name");else updateFilter("full_name", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'full_name') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "table-header name-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Full name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Full name",
                    className: "form-control"
                })
            )
        )
    );
}

function NameColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _.get(row, 'full_name', '')
        )
    );
}

function GroupColumnHeader({ areaProps, filters, updateFilter, groups }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("group_id");
    }, []);

    const onChange = e => {
        updateFilter("group", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'group') === -1 ? null : filterInput.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "table-header status-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Customer group"
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
                        className: "form-control"
                    },
                    groups.map((g, i) => {
                        return React.createElement(
                            "option",
                            { key: i, value: g.customer_group_id },
                            g.group_name
                        );
                    })
                )
            )
        )
    );
}

function GroupColumnRow({ row, groups }) {
    let group = groups.find(g => parseInt(g.customer_group_id) === parseInt(row.group_id));
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            group.group_name
        )
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('customer_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return React.createElement(
        "th",
        { className: "column action-column" },
        React.createElement(
            "div",
            { className: "table-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement("span", null)
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "a",
                    { onClick: () => onClick(), className: "text-danger", title: "Clear filter", href: "javascript:void(0)" },
                    React.createElement("i", { className: "fa fa-filter" }),
                    React.createElement("i", { className: "fa fa-slash", style: { marginLeft: "-13px" } })
                )
            )
        )
    );
}

function ActionColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                A,
                { url: row.editUrl },
                React.createElement("i", { className: "fas fa-edit" })
            )
        )
    );
}

function StatusColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onChange = e => {
        updateFilter("status", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'status') === -1 ? null : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "table-header status-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Status"
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
                        className: "form-control"
                    },
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

function StatusColumnRow({ row }) {
    if (parseInt(_.get(row, "status")) === 1) return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-success" },
            "Enable"
        )
    );else return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-secondary" },
            "Disabled"
        )
    );
}

export default function CustomerGrid({ apiUrl, areaProps, groups = [] }) {
    const [customers, setCustomers] = React.useState([]);
    const [fields, setFields] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.customerCollection.customers')) {
                setCustomers(_.get(response, 'payload.data.customerCollection.customers'));
                setTotal(_.get(response, 'payload.data.customerCollection.total'));
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

        return `{customerCollection ${filterStr} {customers {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "customer-grid mt-4" },
        React.createElement(
            "table",
            { className: "table table-bordered sticky" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        className: "",
                        id: "customer_grid_header",
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
                            component: EmailColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 15,
                            id: "email"
                        }, {
                            component: NameColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 20,
                            id: "name"
                        }, {
                            component: GroupColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter, groups }),
                            sort_order: 25,
                            id: "group"
                        }, {
                            component: StatusColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 30,
                            id: "status"
                        }, {
                            component: ActionColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 35,
                            id: "action"
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                customers.map((c, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "customer_grid_row",
                            row: c,
                            noOuter: true,
                            coreWidgets: [{
                                component: IdColumnRow,
                                props: { row: c },
                                sort_order: 10,
                                id: "id"
                            }, {
                                component: EmailColumnRow,
                                props: { row: c },
                                sort_order: 15,
                                id: "email"
                            }, {
                                component: NameColumnRow,
                                props: { row: c },
                                sort_order: 20,
                                id: "name"
                            }, {
                                component: GroupColumnRow,
                                props: { row: c, groups },
                                sort_order: 25,
                                id: "group"
                            }, {
                                component: StatusColumnRow,
                                props: { row: c },
                                sort_order: 30,
                                id: "status"
                            }, {
                                component: ActionColumnRow,
                                props: { row: c },
                                sort_order: 35,
                                id: "action"
                            }]
                        })
                    );
                })
            )
        ),
        customers.length === 0 && React.createElement(
            "div",
            null,
            "There is no customer to display"
        ),
        React.createElement(Pagination, { total: total, currentFilters: areaProps.filters, setFilter: areaProps.updateFilter })
    );
}