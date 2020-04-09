import Area from "../../../../../../../js/production/area.js";

function ItemOptions({ options = [] }) {
    if (options.length === 0) return null;
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));

    return React.createElement(
        'div',
        { className: 'cart-item-options' },
        React.createElement(
            'ul',
            { className: 'uk-list' },
            options.map((o, i) => {
                return React.createElement(
                    'li',
                    { key: i },
                    React.createElement(
                        'span',
                        { className: 'option-name' },
                        React.createElement(
                            'strong',
                            null,
                            o.option_name,
                            ' : '
                        )
                    ),
                    o.values.map((v, k) => {
                        const _extraPrice = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(v.extra_price);
                        return React.createElement(
                            'span',
                            { key: k },
                            React.createElement(
                                'i',
                                { className: 'value-text' },
                                v.value_text
                            ),
                            React.createElement(
                                'span',
                                { className: 'extra-price' },
                                '(',
                                _extraPrice,
                                ')'
                            ),
                            ' '
                        );
                    })
                );
            })
        )
    );
}

function ProductColumn({ name, sku, options = [] }) {
    return React.createElement(
        'td',
        null,
        React.createElement(
            'div',
            { className: 'product-column' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    null,
                    name
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    null,
                    'Sku'
                ),
                ': ',
                React.createElement(
                    'span',
                    null,
                    sku
                )
            ),
            React.createElement(ItemOptions, { options: options })
        )
    );
}

export default function Items({ items }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    return React.createElement(
        'div',
        { className: "uk-width-1-1 uk-overflow-auto" },
        React.createElement(
            'div',
            { className: 'border-block' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Products'
                )
            ),
            React.createElement(
                'table',
                { className: "uk-table uk-table-small" },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(Area, {
                            id: 'order_item_table_header',
                            noOuter: true,
                            coreWidgets: [{
                                component: "th",
                                props: { children: React.createElement(
                                        'span',
                                        null,
                                        'Product'
                                    ), 'key': 'product' },
                                sort_order: 10,
                                id: "product"
                            }, {
                                component: "th",
                                props: { children: React.createElement(
                                        'span',
                                        null,
                                        'Price'
                                    ), 'key': 'price' },
                                sort_order: 20,
                                id: "price"
                            }, {
                                component: "th",
                                props: { children: React.createElement(
                                        'span',
                                        null,
                                        'Qty'
                                    ), 'key': 'qty' },
                                sort_order: 30,
                                id: "qty"
                            }, {
                                component: "th",
                                props: { children: React.createElement(
                                        'span',
                                        null,
                                        'Total'
                                    ), 'key': 'total' },
                                sort_order: 40,
                                id: "total"
                            }]
                        })
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    items.map((i, k) => {
                        const _price = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.product_price);
                        const _finalPrice = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.final_price);
                        const _total = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.total);
                        return React.createElement(
                            'tr',
                            null,
                            React.createElement(Area, {
                                key: k,
                                id: "order_item_row_" + i.item_id,
                                noOuter: true,
                                item: i,
                                coreWidgets: [{
                                    component: ProductColumn,
                                    props: { name: i.product_name, sku: i.product_sku, options: i.options },
                                    sort_order: 10,
                                    id: "product"
                                }, {
                                    component: "td",
                                    props: { children: [React.createElement(
                                            'div',
                                            { key: 1 },
                                            _price
                                        ), React.createElement(
                                            'div',
                                            { key: 2 },
                                            _finalPrice
                                        )], 'key': 'price' },
                                    sort_order: 20,
                                    id: "price"
                                }, {
                                    component: "td",
                                    props: { children: React.createElement(
                                            'span',
                                            null,
                                            i.qty
                                        ), 'key': 'qty' },
                                    sort_order: 30,
                                    id: "qty"
                                }, {
                                    component: "td",
                                    props: { children: React.createElement(
                                            'span',
                                            null,
                                            _total
                                        ), 'key': 'total' },
                                    sort_order: 40,
                                    id: "total"
                                }]
                            })
                        );
                    })
                )
            )
        )
    );
}