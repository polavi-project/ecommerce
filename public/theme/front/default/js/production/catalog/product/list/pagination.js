var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { buildFilterToQuery } from "./buildFilterToQuery.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

export default function Pagination({ total }) {
    const filters = ReactRedux.useSelector(state => {
        return _extends({}, _.get(state, 'appState.productCollectionFilter'));
    });
    const limit = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionFilter.limit.value', 20));
    const current = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionFilter.page.value', 1));
    const [isOnEdit, setIsOnEdit] = React.useState(false);
    const [inputVal, setInPutVal] = React.useState(current);
    const currentUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.currentUrl');
    });

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);

    const onKeyPress = e => {
        if (e.which !== 13) return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if (page < 1) page = 1;
        if (page > Math.ceil(total / limit)) page = Math.ceil(total / limit);
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { page: { operator: "=", value: page } })));
        Fetch(url, true, "GET");
        setIsOnEdit(false);
    };

    const onPrev = e => {
        e.preventDefault();
        let prev = current - 1;
        if (current === 1) return;
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { page: { operator: "=", value: prev } })));
        Fetch(url, true, "GET");
    };

    const onNext = e => {
        e.preventDefault();
        let next = current + 1;
        if (current * limit >= total) return;
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { page: { operator: "=", value: next } })));
        Fetch(url, true, "GET");
    };

    const onFirst = e => {
        e.preventDefault();
        if (current === 1) return;
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { page: { operator: "=", value: 1 } })));
        Fetch(url, true, "GET");
    };

    const onLast = e => {
        e.preventDefault();
        if (current === Math.ceil(total / limit)) return;
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(_extends({}, filters, { page: { operator: "=", value: Math.ceil(total / limit) } })));
        Fetch(url, true, "GET");
    };

    return React.createElement(
        "div",
        { className: "products-pagination uk-flex uk-flex-center" },
        React.createElement(
            "ul",
            { className: "uk-pagination" },
            current > 1 && React.createElement(
                "li",
                { className: "prev" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => onPrev(e) },
                    React.createElement(
                        "span",
                        null,
                        "Previous"
                    )
                )
            ),
            React.createElement(
                "li",
                { className: "first" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => onFirst(e) },
                    "1"
                )
            ),
            React.createElement(
                "li",
                { className: "current" },
                isOnEdit === false && React.createElement(
                    "a",
                    { className: "pagination-input-fake uk-input uk-form-small", href: "#", onClick: e => {
                            e.preventDefault();setIsOnEdit(true);
                        } },
                    current
                ),
                isOnEdit === true && React.createElement("input", { className: "uk-input uk-form-small", value: inputVal, onChange: e => setInPutVal(e.target.value), type: "text", onKeyPress: e => onKeyPress(e) })
            ),
            React.createElement(
                "li",
                { className: "last" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => onLast(e) },
                    Math.ceil(total / limit)
                )
            ),
            current * limit < total && React.createElement(
                "li",
                { className: "next" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => onNext(e) },
                    React.createElement(
                        "span",
                        null,
                        "Next"
                    )
                )
            )
        )
    );
}