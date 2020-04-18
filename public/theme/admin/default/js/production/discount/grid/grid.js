var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("coupon_id");
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
            row.coupon_id
        )
    );
}

function CouponColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("coupon");else updateFilter("coupon", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("coupon");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'coupon') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "table-header coupon-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Coupon"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Coupon",
                    className: "form-control"
                })
            )
        )
    );
}

function CouponColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.coupon
    );
}

function DescriptionColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("description");else updateFilter("description", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("description");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'description') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "table-header coupon-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Description"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Description",
                    className: "form-control"
                })
            )
        )
    );
}

function DescriptionColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            _.get(row, 'description', '')
        )
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('coupon_id');
        areaProps.addField('editUrl');
        areaProps.addField('deleteUrl');
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
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { className: "text-danger",
                    href: "javascript:void(0);",
                    onClick: () => {
                        if (window.confirm('Are you sure?')) Fetch(row.deleteUrl, false, 'GET');
                    } },
                React.createElement("i", { className: "fas fa-trash-alt" })
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

function FreeShippingColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onChange = e => {
        updateFilter("free_shipping", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        areaProps.addField("free_shipping");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'free_shipping') === -1 ? null : filterInput.current.value;
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
                    "Free shipping?"
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
                        "Yes"
                    ),
                    React.createElement(
                        "option",
                        { value: 0 },
                        "No"
                    )
                )
            )
        )
    );
}

function FreeShippingColumnRow({ row }) {
    if (parseInt(_.get(row, "free_shipping")) === 1) return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-success" },
            "Yes"
        )
    );else return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "badge badge-secondary" },
            "No"
        )
    );
}

export default function CouponGrid({ apiUrl, areaProps }) {
    const [coupons, setCoupons] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.couponCollection.coupons')) {
                setCoupons(_.get(response, 'payload.data.couponCollection.coupons'));
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

        return `{couponCollection ${filterStr} {coupons {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "coupon-grid mt-4" },
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
                        id: "coupon_grid_header",
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
                            component: CouponColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 20,
                            id: "coupon"
                        }, {
                            component: DescriptionColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 30,
                            id: "description"
                        }, {
                            component: FreeShippingColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 40,
                            id: "free_shipping"
                        }, {
                            component: StatusColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 50,
                            id: "status"
                        }, {
                            component: ActionColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 60,
                            id: "action"
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                coupons.map((c, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "coupon_grid_row",
                            row: c,
                            noOuter: true,
                            coreWidgets: [{
                                component: IdColumnRow,
                                props: { row: c },
                                sort_order: 10,
                                id: "id"
                            }, {
                                component: CouponColumnRow,
                                props: { row: c },
                                sort_order: 20,
                                id: "coupon"
                            }, {
                                component: DescriptionColumnRow,
                                props: { row: c },
                                sort_order: 30,
                                id: "name"
                            }, {
                                component: FreeShippingColumnRow,
                                props: { row: c },
                                sort_order: 40,
                                id: "free_shipping"
                            }, {
                                component: StatusColumnRow,
                                props: { row: c },
                                sort_order: 50,
                                id: "status"
                            }, {
                                component: ActionColumnRow,
                                props: { row: c },
                                sort_order: 60,
                                id: "action"
                            }]
                        })
                    );
                })
            )
        ),
        coupons.length === 0 && React.createElement(
            "div",
            null,
            "There is no coupon to display"
        )
    );
}