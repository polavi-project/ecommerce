import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("attribute_group_id");
    }, []);

    return React.createElement(
        "th",
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
            row.attribute_group_id
        )
    );
}

function NameColumnHeader({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('group_name');
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
                    "Group name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("group_name", "LIKE", `%${e.target.value}%`);
                    },
                    placeholder: "Group name",
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
            row.group_name
        )
    );
}

function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
        areaProps.addField('deleteUrl');
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
            React.createElement(A, { url: _.get(row, 'editUrl', ''), text: "Edit" }),
            React.createElement(
                "span",
                null,
                " "
            ),
            React.createElement(
                "a",
                { className: "uk-link-muted",
                    onClick: () => {
                        if (window.confirm('Are you sure?')) Fetch(row.deleteUrl, false, 'GET');
                    } },
                "Delete"
            )
        )
    );
}

export default function AttributeGrid({ apiUrl }) {
    const [groups, setGroups] = React.useState([]);
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
            if (_.get(response, 'data.payload.data.attributeGroupCollection.groups')) {
                setGroups(_.get(response, 'data.payload.data.attributeGroupCollection.groups'));
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

        return `{attributeGroupCollection ${filterStr} {groups {${fieldStr}} total currentFilter}}`;
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
            { className: "uk-table uk-table-small uk-table-divider" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        className: "",
                        id: "attribute_group_grid_header",
                        addFilter: addFilter,
                        cleanFilter: cleanFilter,
                        addField: addField,
                        applyFilter: applyFilter,
                        noOuter: true,
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
                            component: ActionColumnHeader,
                            props: {},
                            sort_order: 30,
                            id: "action"
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                groups.map((g, i) => {
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(Area, {
                            key: i,
                            className: "",
                            id: "attribute_group_grid_row",
                            row: g,
                            noOuter: true,
                            coreWidgets: [{
                                component: IdColumnRow,
                                props: { row: g },
                                sort_order: 10,
                                id: "id"
                            }, {
                                component: NameColumnRow,
                                props: { row: g },
                                sort_order: 20,
                                id: "name"
                            }, {
                                component: ActionColumnRow,
                                props: { row: g },
                                sort_order: 30,
                                id: "action"
                            }]
                        })
                    );
                })
            )
        ),
        groups.length === 0 && React.createElement(
            "div",
            null,
            "There is no group to display"
        )
    );
}