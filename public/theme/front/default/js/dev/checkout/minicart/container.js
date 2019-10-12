import A from "../../../../../../../js/production/a.js";
import {ReducerRegistry} from "../../../../../../../js/production/reducer_registry.js";
import {REQUEST_END} from "../../../../../../../js/production/event-types.js";

function Minicart({id, items, item_count, discount_amount, tax_amount, grand_total}) {
    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        e.preventDefault();
        setStatus(!status)
    };

    return <div id={id} className={id + "-content-inner"}>
        <a onClick={(e) => onClick(e)}><span uk-icon="cart"></span><span>({item_count})</span></a>
        <div className="mini-cart-content" style={{display: status ? 'block' : 'none'}}>
            <table className="uk-table">
                <tbody>
                {
                    items.map((item, index) => {
                        return <tr key={index}>
                            {/*<td>*/}
                            {/*    <A url={item.url}><img src={item.thumbnail}/></A>*/}
                            {/*</td>*/}
                            <td>
                               <A url={item.url}><span>{item.product_name}</span></A>
                                <div>{item.qty} x {item.final_price}</div>
                            </td>
                        </tr>
                    })
                }
                </tbody>
                <tfoot>
                {tax_amount!==0 &&
                <tr>
                    <td>Tax:</td>
                    <td>{tax_amount}</td>
                </tr>
                }
                {discount_amount!==0 &&
                <tr>
                    <td>Discount:</td>
                    <td>{discount_amount}</td>
                </tr>
                }
                <tr>
                    <td>Total:</td>
                    <td>{grand_total}</td>
                </tr>
                </tfoot>
            </table>
            <A classes="uk-button uk-button-small uk-button-primary" url={window.base_url + "/checkout/index"}><span>Checkout</span></A>
            <A classes="uk-button uk-button-small uk-button-primary" url={window.base_url + "/checkout/cart"}><span>Shopping cart</span></A>
        </div>
    </div>
}

function reducer(state = {}, action = {}) {
    if(action.type === REQUEST_END) {
        if(action.minicart !== undefined)
            return action.minicart;
    }
    return state;
}

ReducerRegistry.register('minicart', reducer);

const mapStateToProps = (state, ownProps) => {
    return state.minicart
};

export default ReactRedux.connect(mapStateToProps)(Minicart);
