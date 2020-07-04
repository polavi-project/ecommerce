import {Fetch} from "../../../../../../../js/production/fetch.js";

function Coupon(props) {
    const [coupon, setCoupon] = React.useState(props.coupon ? props.coupon : "");

    const onChange = (e) => {
        setCoupon(e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        Fetch(props.action, false, "POST", {coupon: coupon});
    };

    return <div className="shopping-cart-coupon uk-width-1-4">
        <p><strong>Coupon code</strong></p>
        <div className="uk-margin">
            <input
                className={"uk-input uk-form-width-medium uk-form-small"}
                type="text" value={coupon}
                onChange={(e) => onChange(e)}
                placeholder={"Enter coupon code"}/>
        </div>
        <button className={"uk-button uk-button-primary uk-button-small"} onClick={(e)=>submit(e)}>Submit</button>
    </div>
}

export default Coupon