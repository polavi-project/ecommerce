var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { PRODUCT_COLLECTION_FILTER_CHANGED } from "../../../../../../../../js/production/event-types.js";

export default function Pagination({ limit, total }) {
    const dispatch = ReactRedux.useDispatch();
    const filters = ReactRedux.useSelector(state => {
        if (_.get(state, 'productCollectionFilter').length > 0) return _.get(state, 'productCollectionFilter');else return _.get(state, 'appState.productCollectionRootFilter');
    });
    const current = ReactRedux.useSelector(state => _.get(state, 'productCollectionFilter.page.value', 1));
    const [isOnEdit, setIsOnEdit] = React.useState(false);
    const [inputVal, setInPutVal] = React.useState(current);

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);
    const onKeyPress = e => {
        if (e.which !== 13) return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if (page < 1) page = 1;
        if (page > Math.ceil(total / limit)) page = Math.ceil(total / limit);
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { page: { operator: "=", value: page } }) } });
        setIsOnEdit(false);
    };

    const onPrev = e => {
        e.preventDefault();
        let prev = current - 1;
        if (current === 1) return;
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { page: { operator: "=", value: prev } }) } });
    };

    const onNext = e => {
        e.preventDefault();
        let next = current + 1;
        if (current * limit >= total) return;
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { page: { operator: "=", value: next } }) } });
    };

    const onFirst = e => {
        e.preventDefault();
        if (current === 1) return;
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { page: { operator: "=", value: 1 } }) } });
    };

    const onLast = e => {
        e.preventDefault();
        if (current === Math.ceil(total / limit)) return;
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { page: { operator: "=", value: Math.ceil(total / limit) } }) } });
    };

    return React.createElement(
        'div',
        { className: 'products-pagination uk-flex-center uk-grid' },
        React.createElement(
            'ul',
            { className: 'uk-pagination' },
            current > 1 && React.createElement(
                'li',
                { className: 'prev' },
                React.createElement(
                    'a',
                    { href: "#", onClick: e => onPrev(e) },
                    React.createElement(
                        'span',
                        null,
                        'Previous'
                    )
                )
            ),
            React.createElement(
                'li',
                { className: 'first' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onFirst(e) },
                    '1'
                )
            ),
            React.createElement(
                'li',
                { className: 'current' },
                isOnEdit === false && React.createElement(
                    'a',
                    { className: 'pagination-input-fake uk-input uk-form-small', href: '#', onClick: e => {
                            e.preventDefault();setIsOnEdit(true);
                        } },
                    current
                ),
                isOnEdit === true && React.createElement('input', { className: 'uk-input uk-form-small', value: inputVal, onChange: e => setInPutVal(e.target.value), type: 'text', onKeyPress: e => onKeyPress(e) })
            ),
            React.createElement(
                'li',
                { className: 'last' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onLast(e) },
                    Math.ceil(total / limit)
                )
            ),
            current * limit < total && React.createElement(
                'li',
                { className: 'next' },
                React.createElement(
                    'a',
                    { href: "#", onClick: e => onNext(e) },
                    React.createElement(
                        'span',
                        null,
                        'Next'
                    )
                )
            )
        )
    );
}