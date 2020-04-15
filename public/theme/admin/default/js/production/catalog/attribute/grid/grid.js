var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("attribute_id");
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
            row.attribute_id
        )
    );
}

function TypeColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("type");
    }, []);

    const onChange = e => {
        updateFilter("type", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'type') === -1 ? null : filterInput.current.value;
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
                    "Type"
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
                        { value: "select" },
                        "Select"
                    ),
                    React.createElement(
                        "option",
                        { value: "multiselect" },
                        "Multi Select"
                    ),
                    React.createElement(
                        "option",
                        { value: "text" },
                        "Text"
                    ),
                    React.createElement(
                        "option",
                        { value: "textarea" },
                        "Textarea"
                    ),
                    React.createElement(
                        "option",
                        { value: "date" },
                        "Date"
                    )
                )
            )
        )
    );
}

function TypeColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.type == 'text' && React.createElement(
            "span",
            null,
            "Text"
        ),
        row.type == 'select' && React.createElement(
            "span",
            null,
            "Select"
        ),
        row.type == 'multiselect' && React.createElement(
            "span",
            null,
            "Multi select"
        ),
        row.type == 'textarea' && React.createElement(
            "span",
            null,
            "Textarea"
        ),
        row.type == 'date' && React.createElement(
            "span",
            null,
            "Date"
        )
    );
}

function IsRequiredColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_required");
    }, []);

    const onChange = e => {
        updateFilter("is_required", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'is_required') === -1 ? null : filterInput.current.value;
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
                    "Is required?"
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

function IsRequiredColumnRow({ row }) {
    if (row.is_required == 1) {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "Yes"
            )
        );
    } else {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "No"
            )
        );
    }
}

function IsFilterableColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_filterable");
    }, []);

    const onChange = e => {
        updateFilter("is_filterable", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'is_filterable') === -1 ? null : filterInput.current.value;
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
                    "Is filterable?"
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

function IsFilterableColumnRow({ row }) {
    if (row.is_filterable == 1) {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "Yes"
            )
        );
    } else {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "No"
            )
        );
    }
}

function DisplayOnFrontendColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("display_on_frontend");
    }, []);

    const onChange = e => {
        updateFilter("display_on_frontend", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'display_on_frontend') === -1 ? null : filterInput.current.value;
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
                    "Display on frontend?"
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

function DisplayOnFrontendColumnRow({ row }) {
    if (row.display_on_frontend == 1) {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "Yes"
            )
        );
    } else {
        return React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                "No"
            )
        );
    }
}

function NameColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_name');
    }, []);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("attribute_name");else updateFilter("attribute_name", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'attribute_name') === -1 ? "" : filterInput.current.value;
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
                    "Attribute name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Attribute name",
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
            row.attribute_name
        )
    );
}

function CodeColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_code');
    }, []);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("attribute_code");else updateFilter("attribute_code", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'attribute_code') === -1 ? "" : filterInput.current.value;
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
                    "Attribute code"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Attribute code",
                    className: "form-control"
                })
            )
        )
    );
}

function CodeColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            row.attribute_code
        )
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
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

export default function AttributeGrid({ apiUrl, areaProps }) {
    const [attributes, setAttributes] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.attributeCollection.attributes')) {
                setAttributes(_.get(response, 'payload.data.attributeCollection.attributes'));
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

        return `{attributeCollection ${filterStr} {attributes {${fieldStr}} total currentFilter}}`;
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
                        id: "attribute_grid_header",
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
                            component: CodeColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 25,
                            id: "code"
                        }, {
                            component: TypeColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 30,
                            id: "type"
                        }, {
                            component: IsRequiredColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 40,
                            id: "isRequired"
                        }, {
                            component: IsFilterableColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 45,
                            id: "isFilterable"
                        }, {
                            component: DisplayOnFrontendColumnHeader,
                            props: _extends({}, areaProps, { addField, applyFilter }),
                            sort_order: 50,
                            id: "display_on_frontend"
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
                attributes.map((a, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "attribute_grid_row",
                            row: a,
                            noOuter: true,
                            coreWidgets: [{
                                component: IdColumnRow,
                                props: { row: a },
                                sort_order: 10,
                                id: "id"
                            }, {
                                component: NameColumnRow,
                                props: { row: a },
                                sort_order: 20,
                                id: "name"
                            }, {
                                component: CodeColumnRow,
                                props: { row: a },
                                sort_order: 25,
                                id: "code"
                            }, {
                                component: TypeColumnRow,
                                props: { row: a },
                                sort_order: 30,
                                id: "type"
                            }, {
                                component: IsRequiredColumnRow,
                                props: { row: a },
                                sort_order: 40,
                                id: "isRequired"
                            }, {
                                component: IsFilterableColumnRow,
                                props: { row: a },
                                sort_order: 45,
                                id: "isFilterable"
                            }, {
                                component: DisplayOnFrontendColumnRow,
                                props: { row: a },
                                sort_order: 50,
                                id: "display_on_frontend"
                            }, {
                                component: ActionColumnRow,
                                props: { row: a },
                                sort_order: 60,
                                id: "action"
                            }]
                        })
                    );
                })
            )
        ),
        attributes.length === 0 && React.createElement(
            "div",
            null,
            "There is no attribute to display"
        )
    );
}