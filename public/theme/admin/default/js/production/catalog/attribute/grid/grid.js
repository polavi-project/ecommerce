import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";

function IdColumnHeader({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("attribute_id");
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
                React.createElement("input", {
                    type: "text",
                    ref: filterFrom,
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                    },
                    placeholder: "From"
                }),
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

function TypeColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("type");
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
                    "Type"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    { className: "uk-select", ref: filterInput, onChange: e => {
                            areaProps.addFilter("type", "Equal", e.target.value);
                        } },
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

function IsRequiredColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_required");
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
                    "Is required?"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    { className: "uk-select", ref: filterInput, onChange: e => {
                            areaProps.addFilter("is_required", "Equal", e.target.value);
                        } },
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

function IsFilterableColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_filterable");
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
                    "Is filterable?"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    { className: "uk-select", ref: filterInput, onChange: e => {
                            areaProps.addFilter("is_filterable", "Equal", e.target.value);
                        } },
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

function NameColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_name');
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
                    "Attribute name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);
                    },
                    placeholder: "Attribute name"
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
        React.createElement(
            "div",
            null,
            React.createElement(A, { url: _.get(row, 'editUrl', ''), text: "Edit" })
        )
    );
}

export default function AttributeGrid({ apiUrl }) {
    const [attributes, setAttributes] = React.useState([]);
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
            if (_.get(response, 'data.payload.data.attributeCollection.attributes')) {
                setAttributes(_.get(response, 'data.payload.data.attributeCollection.attributes'));
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

        return `{attributeCollection ${filterStr} {attributes {${fieldStr}} total currentFilter}}`;
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
                    id: "attribute_grid_header",
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
                        component: NameColumnHeader,
                        props: {},
                        sort_order: 20,
                        id: "name"
                    }, {
                        component: TypeColumnHeader,
                        props: {},
                        sort_order: 30,
                        id: "type"
                    }, {
                        component: IsRequiredColumnHeader,
                        props: {},
                        sort_order: 40,
                        id: "isRequired"
                    }, {
                        component: IsFilterableColumnHeader,
                        props: {},
                        sort_order: 45,
                        id: "isFilterable"
                    }, {
                        component: ActionColumnHeader,
                        props: {},
                        sort_order: 50,
                        id: "action"
                    }]
                })
            ),
            React.createElement(
                "tbody",
                null,
                attributes.map((a, i) => {
                    return React.createElement(Area, {
                        key: i,
                        className: "",
                        id: "attribute_grid_row",
                        row: a,
                        reactcomponent: "tr",
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
                            component: ActionColumnRow,
                            props: { row: a },
                            sort_order: 50,
                            id: "action"
                        }]
                    });
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