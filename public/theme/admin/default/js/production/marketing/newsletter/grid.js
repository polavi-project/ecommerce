var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("newsletter_subscriber_id");
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
            row.newsletter_subscriber_id
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

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('customer_id');
        areaProps.addField('customerEditUrl');
        areaProps.addField('subscribeUrl');
        areaProps.addField('unsubscribeUrl');
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
    const currentUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.currentUrl');
    });

    const unsubscribe = (e, email, customerId) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        formData.append('customer_id', customerId);
        Fetch(row.unsubscribeUrl, false, "POST", formData, null, response => {
            if (parseInt(response.success) === 1) return Fetch(currentUrl);
        });
    };

    const subscribe = (e, email) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        Fetch(row.subscribeUrl, false, "POST", formData, null, response => {
            if (parseInt(response.success) === 1) return Fetch(currentUrl);
        });
    };

    return React.createElement(
        "td",
        null,
        row.customerEditUrl && React.createElement(
            "div",
            null,
            React.createElement(
                A,
                { url: row.customerEditUrl },
                "Visit customer"
            )
        ),
        row.status == "subscribed" && React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { className: "text-danger", href: "#", onClick: e => unsubscribe(e, row.email, row.customer_id) },
                "Unsubscribe"
            )
        ),
        row.status == "unsubscribed" && React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { className: "text-primary", href: "#", onClick: e => subscribe(e, row.email) },
                "Subscribe"
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
                        { value: "subscribed" },
                        "Subscribed"
                    ),
                    React.createElement(
                        "option",
                        { value: "unsubscribed" },
                        "Unsubscribed"
                    )
                )
            )
        )
    );
}

function StatusColumnRow({ row }) {
    if (_.get(row, "status") === "subscribed") return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-success" },
            "Subscribed"
        )
    );else return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-secondary" },
            "Unsubscribed"
        )
    );
}

export default function SubscriberGrid({ apiUrl, areaProps }) {
    const [subscribers, setSubscribers] = React.useState([]);
    const [fields, setFields] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.subscriberCollection.subscribers')) {
                setSubscribers(_.get(response, 'payload.data.subscriberCollection.subscribers'));
                setTotal(_.get(response, 'payload.data.subscriberCollection.total'));
            }
        });
    };

    const buildQuery = () => {
        let filters = [];
        areaProps.filters.forEach((f, i) => {
            filters.push(`{key: "${f.key}" operator: "${f.operator}" value: "${f.value}"}`);
        });
        let filterStr = filters.length > 0 ? `[${filters.join(",")}]` : "[]";

        let fieldStr = "";
        fields.forEach((f, i) => {
            fieldStr += `${f} `;
        });

        return `{subscriberCollection (filters : ${filterStr}) {subscribers {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "subscriber-grid mt-4" },
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
                        id: "subscriber_grid_header",
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
                subscribers.map((c, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "subscriber_grid_row",
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
        subscribers.length === 0 && React.createElement(
            "div",
            null,
            "There is no subscriber to display"
        ),
        React.createElement(Pagination, { total: total, page: _.get(areaProps.filters.find(e => e.key === 'page'), 'value', 1), limit: _.get(areaProps.filters.find(e => e.key === 'limit'), 'value', 20), setFilter: areaProps.updateFilter })
    );
}