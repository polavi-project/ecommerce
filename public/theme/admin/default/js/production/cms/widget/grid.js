var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("cms_widget_id");
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
            row.cms_widget_id
        )
    );
}

function NameColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("name");else updateFilter("name", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("name");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header coupon-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Name",
                    className: "uk-input uk-form-small uk-form-width-small"
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
            _.get(row, 'name', '')
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
            { className: "header status-header" },
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
                        className: "uk-select uk-form-small uk-form-width-small"
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
            { className: "uk-label uk-label-success" },
            "Enable"
        )
    );else return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "uk-label uk-label-danger" },
            "Disabled"
        )
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('cms_widget_id');
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

export default function WidgetGrid({ apiUrl, areaProps }) {
    const [widgets, setWidgets] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.widgetCollection.widgets')) {
                setWidgets(_.get(response, 'payload.data.widgetCollection.widgets'));
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

        return `{widgetCollection ${filterStr} {widgets {${fieldStr}} total currentFilter}}`;
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
            { className: "uk-table uk-table-small" },
            React.createElement(
                "thead",
                null,
                React.createElement(Area, {
                    className: "",
                    id: "widget_grid_header",
                    filters: areaProps.filters,
                    addFilter: areaProps.addFilter,
                    updateFilter: areaProps.updateFilter,
                    removeFilter: areaProps.removeFilter,
                    cleanFilter: areaProps.cleanFilter,
                    addField: addField,
                    applyFilter: applyFilter,
                    reactcomponent: "tr",
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
                        component: ActionColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 40,
                        id: "action"
                    }]
                })
            ),
            React.createElement(
                "tbody",
                null,
                widgets.map((p, i) => {
                    return React.createElement(Area, {
                        key: i,
                        className: "",
                        id: "widget_grid_row",
                        row: w,
                        reactcomponent: "tr",
                        coreWidgets: [{
                            component: IdColumnRow,
                            props: { row: w },
                            sort_order: 10,
                            id: "id"
                        }, {
                            component: NameColumnRow,
                            props: { row: w },
                            sort_order: 20,
                            id: "name"
                        }, {
                            component: StatusColumnRow,
                            props: { row: w },
                            sort_order: 30,
                            id: "status"
                        }, {
                            component: ActionColumnRow,
                            props: { row: w },
                            sort_order: 40,
                            id: "action"
                        }]
                    });
                })
            )
        ),
        widgets.length === 0 && React.createElement(
            "div",
            null,
            "There is no widget to display"
        )
    );
}