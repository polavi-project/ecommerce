var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps, filters, updateFilter }) {
    React.useEffect(() => {
        areaProps.addField("category_id");
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
            row.category_id
        )
    );
}

function NameColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("name");else updateFilter("name", "LIKE", `%${e.target.value}%`);
        }
    };

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
                    "Category name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Category name",
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
            row.name
        )
    );
}

function ActionColumnHeader({ areaProps, filters, updateFilter }) {
    React.useEffect(() => {
        areaProps.addField('category_id');
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

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    const onChange = e => {
        updateFilter("status", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'status') === -1 ? null : filterInput.current.value;
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
                    "Status"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    {
                        className: "form-control",
                        ref: filterInput,
                        onChange: e => onChange(e)
                    },
                    React.createElement(
                        "option",
                        { value: 1 },
                        "Enable"
                    ),
                    React.createElement(
                        "option",
                        { value: 0 },
                        "Disable"
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

function ShowNavColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("include_in_nav");
    }, []);

    const onChange = e => {
        updateFilter("include_in_nav", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'include_in_nav') === -1 ? null : filterInput.current.value;
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
                    "Show in navigation?"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    {
                        className: "form-control",
                        ref: filterInput,
                        onChange: e => onChange(e)
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

function ShowNavColumnRow({ row }) {
    if (parseInt(_.get(row, "status")) === 1) return React.createElement(
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

export default function CategoryGrid({ apiUrl, areaProps }) {
    const [categories, setCategories] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.categoryCollection.categories')) {
                setCategories(_.get(response, 'payload.data.categoryCollection.categories'));
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

        return `{categoryCollection ${filterStr} {categories {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "category-grid mt-4" },
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
                        id: "category_grid_header",
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
                            component: ShowNavColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 40,
                            id: "show_nav"
                        }, {
                            component: ActionColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 50,
                            id: "action"
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                categories.map((c, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "category_grid_row",
                            row: c,
                            noOuter: true,
                            coreWidgets: [{
                                component: IdColumnRow,
                                props: { row: c },
                                sort_order: 10,
                                id: "id"
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
                                component: ShowNavColumnRow,
                                props: { row: c },
                                sort_order: 40,
                                id: "show_nav"
                            }, {
                                component: ActionColumnRow,
                                props: { row: c },
                                sort_order: 50,
                                id: "action"
                            }]
                        })
                    );
                })
            )
        ),
        categories.length === 0 && React.createElement(
            "div",
            null,
            "There is no category to display"
        )
    );
}