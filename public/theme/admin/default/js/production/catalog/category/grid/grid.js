import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";

function IdColumn({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("category_id");
    }, []);

    return React.createElement(
        "div",
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
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    r.category_id
                )
            );
        })
    );
}

function NameColumn({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    return React.createElement(
        "div",
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
                    "Category name"
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
                    placeholder: "Category name"
                })
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _.get(r, 'name', '')
                )
            );
        })
    );
}

function GeneralColumn({ index, title, areaProps }) {
    React.useEffect(() => {
        areaProps.addField(index);
    }, []);
    return React.createElement(
        "div",
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
                    title
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _.get(r, index, '')
                )
            );
        })
    );
}
function ActionColumn({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);
    return React.createElement(
        "div",
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
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(A, { url: _.get(r, 'editUrl', ''), text: "Edit" })
            );
        })
    );
}

function StatusColumn({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    return React.createElement(
        "div",
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
                React.createElement("input", { type: "text", ref: filterInput, onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("status", "Equal", e.target.value);
                    } })
            )
        ),
        areaProps.rows.map((r, i) => {
            if (parseInt(_.get(r, "status")) === 1) return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement(
                    "span",
                    { className: "uk-label uk-label-success" },
                    "Enable"
                )
            );else return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement(
                    "span",
                    { className: "uk-label uk-label-danger" },
                    "Disabled"
                )
            );
        })
    );
}

export default function CategoryGrid({ apiUrl }) {
    const [categories, setCategories] = React.useState([]);
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
            if (_.get(response, 'data.payload.data.categoryCollection.categories')) {
                setCategories(_.get(response, 'data.payload.data.categoryCollection.categories'));
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

        return `{categoryCollection ${filterStr} {categories {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, filters]);

    return React.createElement(
        "div",
        { className: "grid category-grid" },
        React.createElement(Area, {
            className: "uk-grid uk-grid-small",
            id: "category-grid",
            rows: categories,
            addFilter: addFilter,
            cleanFilter: cleanFilter,
            addField: addField,
            coreWidgets: [{
                component: IdColumn,
                props: {},
                sort_order: 10,
                id: "id"
            }, {
                component: NameColumn,
                props: {},
                sort_order: 30,
                id: "name"
            }, {
                component: StatusColumn,
                props: {},
                sort_order: 40,
                id: "status"
            }, {
                component: ActionColumn,
                props: {},
                sort_order: 50,
                id: "editColumn"
            }]
        })
    );
}