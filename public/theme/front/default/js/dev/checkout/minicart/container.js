import A from "../../../../../../../js/production/a.js";

export default function Minicart({cartUrl, checkoutUrl}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const items = ReactRedux.useSelector(state => _.get(state, 'appState.cart.items', []));
    const subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(ReactRedux.useSelector(state => _.get(state, 'appState.cart.subTotal')));
    const [show, setShow] = React.useState(false);

    const onOpen = (e) => {
        e.preventDefault();
        setShow(true);
    };

    const onClose = (e) => {
        e.preventDefault();
        setShow(false);
    };

    if(items.length === 0)
        return <div className="mini-cart-wrapper">
            <a href="#" onClick={(e)=> onOpen(e)}><span>Cart</span><span>({items.length})</span></a>
            <div className="mini-cart-content" style={{display: show === false ? "none" : "block"}}>
                <div className="d-flex justify-content-end">
                    <a href="#" onClick={(e)=> onClose(e)}>X</a>
                </div>
                <div>
                    <span>You have no item in cart</span>
                </div>
            </div>
        </div>;

    return <div className="mini-cart-wrapper">
        <a href="#" onClick={(e)=> onOpen(e)} className=""><span>Cart</span><span>({items.length})</span></a>
        <div className="mini-cart-content" style={{display: show === false ? "none" : "block"}}>
            <div className="d-flex justify-content-end">
                <a href="#" onClick={(e)=> onClose(e)}>X</a>
            </div>
            <div className="">
                {
                    items.map((item, index) => {
                        const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                        return <div key={index} className="container">
                            <div className="row">
                                <div className="col-9">
                                    <A url={item.url}><span>{item.product_name}</span></A>
                                    <div>{item.qty} x {_price}</div>
                                </div>
                                <div className="col-3">x</div>
                            </div>
                        </div>
                    })
                }
                <div className="d-flex justify-content-end mt-4">
                    <div className="">
                        <span>Total: </span>
                        <span>{subTotal}</span>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
                <A className="btn btn-primary mr-2" url={cartUrl}><span>Shopping cart</span></A>
                <A className="btn btn-primary" url={checkoutUrl}><span>Checkout</span></A>
            </div>
        </div>
    </div>
}