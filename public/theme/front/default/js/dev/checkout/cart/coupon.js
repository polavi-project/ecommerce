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

    return <div className="shopping-cart-coupon col-12 col-md-4">
        <h4><strong>Coupon code</strong></h4>
        <div className="mb-4">
            <input
                className={"form-control"}
                type="text" value={coupon}
                onChange={(e) => onChange(e)}
                placeholder={"Enter coupon code"}/>
        </div>
        <button className={"btn btn-primary"} onClick={(e)=>submit(e)}>Submit</button>
    </div>
}

export default Coupon