var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../../js/production/fetch.js";
import { buildFilterToQuery } from "./buildFilterToQuery.js";

export default function Sorting({ sorting_options = [] }) {
    const filters = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.productCollectionFilter');
    });
    const sortByRef = React.useRef("");
    React.useEffect(() => {
        sortByRef.current.value = _.get(filters, "sortBy.value");
    });
    const currentUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.currentUrl');
    });

    const onChangeSort = e => {
        e.preventDefault();
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { sortBy: { operator: "=", value: sortByRef.current.value } })));
        if (_.get(filters, 'sortOrder.value') === "ASC") {
            Fetch(url, true, "GET");
        } else Fetch(url, true, "GET");
    };

    const onChangeDirection = e => {
        e.preventDefault();
        let url = new URL(currentUrl);

        if (_.get(filters, 'sortOrder.value') === "ASC") {
            url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { sortOrder: { operator: "=", value: "DESC" } })));
            Fetch(url, true, "GET");
        } else {
            url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { sortOrder: { operator: "=", value: "ASC" } })));
            Fetch(url, true, "GET");
        }
    };

    if (sorting_options.length === 0) return null;

    return React.createElement(
        "div",
        { className: "product-sorting uk-clearfix uk-flex-right uk-flex" },
        React.createElement(
            "div",
            { className: "product-sorting-inner uk-flex-right uk-flex" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { className: "label" },
                    "Sort By"
                )
            ),
            React.createElement(
                "select",
                {
                    className: "uk-select uk-form-small",
                    onChange: e => onChangeSort(e),
                    ref: sortByRef
                },
                React.createElement(
                    "option",
                    { value: "", disabled: true },
                    "Sort product"
                ),
                sorting_options.map((s, i) => {
                    return React.createElement(
                        "option",
                        { value: s.code, key: i },
                        s.name
                    );
                })
            ),
            React.createElement(
                "div",
                { className: "sort-direction" },
                React.createElement(
                    "a",
                    { onClick: e => onChangeDirection(e) },
                    React.createElement("span", { "uk-icon": _.get(filters, 'sortOrder.value') === "DESC" ? "icon: arrow-up; ratio: 1" : "icon: arrow-down; ratio: 1" })
                )
            )
        )
    );
}