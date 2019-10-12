var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import A from "../a.js";
import { Fetch } from "../fetch.js";
import { PAGINATION_UPDATED } from "../event-types.js";
import Pagination from "./pagination.js";
import Area from "../area.js";

export default function Grid(props) {
    const [filters, setFilters] = React.useState(() => {
        let filters = [];
        props.columns.forEach(i => {
            if (i.filterable === true) if (i.filter_type === 'range') {
                filters[i.graphql_field + '_form'] = props.filters && props.filters[i.graphql_field + '_form'] ? props.filters[i.graphql_field + '_form'] : '';
                filters[i.graphql_field + '_to'] = props.filters && props.filters[i.graphql_field + '_to'] ? props.filters[i.graphql_field + '_to'] : '';
            } else filters[i.graphql_field] = props.filters && props.filters[i.graphql_field] ? props.filters[i.graphql_field] : '';
        });

        // For sorting
        filters['sort_by'] = props.filters && props.filters['sort_by'] ? props.filters['sort_by'] : '';
        filters['sort_order'] = props.filters && props.filters['sort_order'] ? props.filters['sort_order'] : '';
        filters['limit'] = props.filters && props.filters['limit'] ? props.filters['limit'] : 20;
        filters['page'] = props.filters && props.filters['page'] ? props.filters['page'] : 1;

        return filters;
    });
    const [canFilter, setCanFilter] = React.useState(false);

    const onChange = (e, index) => {
        setFilters(_extends({}, filters, { [index]: e.target.value }));
        if (e.target.type === "select-one") setCanFilter(true);
    };

    const applyFilter = () => {
        let url = new URL(document.location);
        for (var key in filters) {
            if (filters.hasOwnProperty(key)) {
                if (filters[key]) {
                    url.searchParams.set(key, filters[key]);
                } else {
                    url.searchParams.delete(key);
                }
            } else url.searchParams.delete(key);
        }

        Fetch(url);
    };

    const applySort = index => {
        if (filters.sort_order === '') {
            setFilters(_extends({}, filters, { sort_by: index, sort_order: 'ASC' }));
        } else setFilters(_extends({}, filters, { sort_by: index, sort_order: filters.sort_order === 'DESC' ? 'ASC' : 'DESC' }));
        setCanFilter(true);
    };

    React.useEffect(() => {
        if (canFilter === true) applyFilter();
    });

    React.useEffect(() => {
        let token = PubSub.subscribe(PAGINATION_UPDATED, function (message, data) {
            if (data.gridId === props.id) {
                setFilters(_extends({}, filters, { limit: data.limit, page: data.currentPage }));
                setCanFilter(true);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    const resetFilter = e => {
        let url = new URL(document.location);
        let keys = Object.keys(filters);
        for (var i = 0; i < keys.length; i++) {
            url.searchParams.delete(keys[i]);
        }
        Fetch(url);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "grid-buttons" },
            React.createElement(Area, { id: "grid_buttons", widgets: [] })
        ),
        React.createElement(Pagination, { gridId: props.id, total: props.total, limit: filters.limit, currentPage: filters.page }),
        React.createElement(
            "table",
            { className: "uk-table uk-table-divider uk-table-striped uk-table-small uk-table-justify" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    { className: "name sort" },
                    props.columns.map((col, index) => {
                        return React.createElement(
                            "th",
                            { key: index },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "span",
                                    null,
                                    col.name
                                ),
                                col.sortable === true && React.createElement(
                                    "a",
                                    { href: "javascript:void(0)", onClick: () => applySort(col.graphql_field) },
                                    filters.sort_order === 'DESC' && React.createElement("span", { className: "uk-icon", "uk-icon": "arrow-up" }),
                                    filters.sort_order === 'ASC' && React.createElement("span", { className: "uk-icon", "uk-icon": "arrow-down" }),
                                    filters.sort_order === '' && React.createElement("span", { className: "uk-icon", "uk-icon": "arrow-up" })
                                )
                            )
                        );
                    })
                ),
                React.createElement(
                    "tr",
                    { className: "filter" },
                    props.columns.map((col, index) => {
                        return React.createElement(
                            "td",
                            { key: index },
                            col.filterable === true && React.createElement(
                                "div",
                                null,
                                col.filter_type === 'text' && React.createElement("input", { className: "uk-input uk-form-small",
                                    name: col.graphql_field,
                                    type: "text",
                                    value: filters[col.graphql_field],
                                    onChange: e => onChange(e, col.graphql_field),
                                    onKeyPress: e => {
                                        if (e.key === 'Enter') setCanFilter(true);
                                    } }),
                                col.filter_type === 'range' && React.createElement(
                                    "div",
                                    null,
                                    "Form: ",
                                    React.createElement("input", { className: "uk-input uk-form-small",
                                        type: "text",
                                        name: col.graphql_field + '_form',
                                        value: filters[col.graphql_field + '_form'],
                                        onKeyPress: e => {
                                            if (e.key === 'Enter') setCanFilter(true);
                                        },
                                        onChange: e => onChange(e, col.graphql_field + '_form') }),
                                    React.createElement("br", null),
                                    "To: ",
                                    React.createElement("input", { className: "uk-input uk-form-small",
                                        type: "text",
                                        name: col.graphql_field + '_to',
                                        value: filters[col.graphql_field + '_to'],
                                        onKeyPress: e => {
                                            if (e.key === 'Enter') setCanFilter(true);
                                        },
                                        onChange: e => onChange(e, col.graphql_field + '_to') })
                                ),
                                col.filter_type === 'select' && React.createElement(
                                    "select",
                                    { className: "uk-select uk-form-small", name: col.graphql_field, onChange: e => onChange(e, col.graphql_field), value: filters[col.graphql_field] },
                                    React.createElement(
                                        "option",
                                        { value: "", disabled: true },
                                        "Please select"
                                    ),
                                    col.filter_options.map((o, i) => {
                                        return React.createElement(
                                            "option",
                                            { key: i, value: o.value },
                                            o.text
                                        );
                                    })
                                )
                            ),
                            col.column === 'action' && React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "a",
                                    { className: "uk-button uk-button-primary uk-button-small", onClick: e => applyFilter(e) },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Apply"
                                    )
                                ),
                                React.createElement("br", null),
                                React.createElement(
                                    "a",
                                    { className: "uk-button uk-button-danger uk-button-small", onClick: e => resetFilter(e) },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Reset"
                                    )
                                )
                            )
                        );
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                props.rows.map((row, index) => {
                    return React.createElement(
                        "tr",
                        { key: index },
                        props.columns.map((col, i) => {
                            if (col.column === 'action') {
                                return React.createElement(
                                    "td",
                                    { key: i },
                                    row['action'].map((a, i) => {
                                        return React.createElement(A, { key: i, url: a.url, text: a.text });
                                    })
                                );
                            } else return React.createElement(
                                "td",
                                { key: i },
                                React.createElement(
                                    "span",
                                    null,
                                    row[col.graphql_field]
                                )
                            );
                        })
                    );
                }),
                props.rows.length === 0 && React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        { colSpan: props.columns.length },
                        React.createElement(
                            "span",
                            null,
                            "There is no item to display"
                        )
                    )
                )
            )
        )
    );
}