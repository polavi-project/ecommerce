var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { PRODUCT_COLLECTION_FILTER_CHANGED } from "../../../../../../../../js/production/event-types.js";

export default function Sorting({ sorting_options = [] }) {
    const dispatch = ReactRedux.useDispatch();
    const filters = ReactRedux.useSelector(state => {
        return _extends({}, _.get(state, 'appState.productCollectionRootFilter'), _.get(state, 'productCollectionFilter'));
    });

    const onChangeSort = e => {
        e.preventDefault();
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { sortBy: { operator: "=", value: e.target.value } }) } });
    };

    const onChangeDirection = e => {
        e.preventDefault();
        if (_.get(filters, 'sortOrder.value') === "ASC") dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { sortOrder: { operator: "=", value: "DESC" } }) } });else dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': _extends({}, filters, { sortOrder: { operator: "=", value: "ASC" } }) } });
    };

    if (sorting_options.length === 0) return null;

    return React.createElement(
        'div',
        { className: 'product-sorting uk-clearfix uk-flex-right uk-flex' },
        React.createElement(
            'div',
            { className: 'product-sorting-inner uk-flex-right uk-flex' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'label' },
                    'Sort By'
                )
            ),
            React.createElement(
                'select',
                { className: 'uk-select uk-form-small', onChange: e => onChangeSort(e), value: _.get(filters, 'sortBy.value') },
                React.createElement(
                    'option',
                    { value: '', disabled: true },
                    'Sort product'
                ),
                sorting_options.map((s, i) => {
                    return React.createElement(
                        'option',
                        { value: s.code, key: i },
                        s.name
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'sort-direction' },
                React.createElement(
                    'a',
                    { onClick: e => onChangeDirection(e) },
                    React.createElement('span', { 'uk-icon': _.get(filters, 'sortOrder.value') === "DESC" ? "icon: arrow-up; ratio: 1" : "icon: arrow-down; ratio: 1" })
                )
            )
        )
    );
}