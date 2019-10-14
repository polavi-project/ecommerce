import Area from "../../../../../../../js/production/area.js";

function ProductColumn({ name, sku, options = []}) {
    return <td>
        <div className="product-column">
            <div><span>{name}</span></div>
            <div><span>Sku</span>: <span>{sku}</span></div>
            {options.map((o,i) => {
                return <div><i><strong>{o.option_name}</strong></i> : <span>{o.option_value_text}</span></div>
            })}
        </div>
    </td>
}
export default function Items({items}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    return <div className={"uk-width-1-1 uk-overflow-auto"}>
        <table className={"uk-table uk-table-small"}>
            <thead>
                <Area
                    id="order_item_table_header"
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: "th",
                            props : {children: <span>Product</span>, 'key': 'product'},
                            sort_order: 10,
                            id: "product"
                        },
                        {
                            component: "th",
                            props : {children: <span>Price</span>, 'key': 'price'},
                            sort_order: 20,
                            id: "price"
                        },
                        {
                            component: "th",
                            props : {children: <span>Qty</span>, 'key': 'qty'},
                            sort_order: 30,
                            id: "qty"
                        },
                        {
                            component: "th",
                            props : {children: <span>Total</span>, 'key': 'total'},
                            sort_order: 40,
                            id: "total"
                        }
                    ]}
                />
            </thead>
            <tbody>
            { items.map((i, k) => {
                const _price = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.product_price);
                const _finalPrice = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.final_price);
                const _total = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(i.total);
                return <Area
                    key={k}
                    id={"order_item_row_" + i.itemId}
                    reactcomponent={"tr"}
                    item={i}
                    coreWidgets={[
                        {
                            component: ProductColumn,
                            props : {name: i.product_name, sku: i.product_sku, options: i.item_options},
                            sort_order: 10,
                            id: "product"
                        },
                        {
                            component: "td",
                            props : {children: [<div key={1}>{_price}</div>, <div key={2}>{_finalPrice}</div>], 'key': 'price'},
                            sort_order: 20,
                            id: "price"
                        },
                        {
                            component: "td",
                            props : {children: <span>{i.qty}</span>, 'key': 'qty'},
                            sort_order: 30,
                            id: "qty"
                        },
                        {
                            component: "td",
                            props : {children: <span>{_total}</span>, 'key': 'total'},
                            sort_order: 40,
                            id: "total"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
    </div>
}