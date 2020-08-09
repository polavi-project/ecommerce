import { buildFilterToQuery } from "./buildFilterToQuery.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

export default function Pagination({ total, limit, currentPage }) {
    const filters = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.productCollectionFilter');
    });
    const [isOnEdit, setIsOnEdit] = React.useState(false);
    const [inputVal, setInPutVal] = React.useState(currentPage);
    const currentUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.currentUrl');
    });

    React.useEffect(() => {
        setInPutVal(currentPage);
    }, [currentPage]);

    const onKeyPress = e => {
        if (e.which !== 13) return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if (page < 1) page = 1;
        if (page > Math.ceil(total / limit)) page = Math.ceil(total / limit);
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{ key: "page", operator: "=", value: page }]]), true, "GET");
        setIsOnEdit(false);
    };

    const onPrev = e => {
        e.preventDefault();
        let prev = currentPage - 1;
        if (currentPage === 1) return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{ key: "page", operator: "=", value: prev }]]), true, "GET");
    };

    const onNext = e => {
        e.preventDefault();
        let next = currentPage + 1;
        if (currentPage * limit >= total) return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{ key: "page", operator: "=", value: next }]]), true, "GET");
    };

    const onFirst = e => {
        e.preventDefault();
        if (currentPage === 1) return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{ key: "page", operator: "=", value: 1 }]]), true, "GET");
    };

    const onLast = e => {
        e.preventDefault();
        if (currentPage === Math.ceil(total / limit)) return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{ key: "page", operator: "=", value: Math.ceil(total / limit) }]]), true, "GET");
    };

    return React.createElement(
        "div",
        { className: "products-pagination" },
        React.createElement(
            "ul",
            { className: "pagination" },
            currentPage > 1 && React.createElement(
                "li",
                { className: "page-item prev" },
                React.createElement(
                    "a",
                    { className: "page-link", href: "#", onClick: e => onPrev(e) },
                    React.createElement(
                        "span",
                        null,
                        "Previous"
                    )
                )
            ),
            React.createElement(
                "li",
                { className: "page-item first" },
                React.createElement(
                    "a",
                    { className: "page-link", href: "#", onClick: e => onFirst(e) },
                    "1"
                )
            ),
            React.createElement(
                "li",
                { className: "page-item current" },
                isOnEdit === false && React.createElement(
                    "a",
                    { className: "page-link pagination-input-fake uk-input uk-form-small", href: "#", onClick: e => {
                            e.preventDefault();setIsOnEdit(true);
                        } },
                    currentPage
                ),
                isOnEdit === true && React.createElement("input", { className: "page-link uk-input uk-form-small", value: inputVal, onChange: e => setInPutVal(e.target.value), type: "text", onKeyPress: e => onKeyPress(e) })
            ),
            React.createElement(
                "li",
                { className: "page-item last" },
                React.createElement(
                    "a",
                    { className: "page-link", href: "#", onClick: e => onLast(e) },
                    Math.ceil(total / limit)
                )
            ),
            currentPage * limit < total && React.createElement(
                "li",
                { className: "page-item next" },
                React.createElement(
                    "a",
                    { className: "page-link", href: "#", onClick: e => onNext(e) },
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