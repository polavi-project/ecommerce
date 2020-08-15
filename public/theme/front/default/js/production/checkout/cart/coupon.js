import { Fetch } from "../../../../../../../js/production/fetch.js";

function Coupon(props) {
    const [coupon, setCoupon] = React.useState(props.coupon ? props.coupon : "");

    const onChange = e => {
        setCoupon(e.target.value);
    };

    const submit = e => {
        e.preventDefault();
        Fetch(props.action, false, "POST", { coupon: coupon });
    };

    return React.createElement(
        "div",
        { className: "shopping-cart-coupon col-12 col-md-4" },
        React.createElement(
            "h4",
            null,
            React.createElement(
                "strong",
                null,
                "Coupon code"
            )
        ),
        React.createElement(
            "div",
            { className: "mb-4" },
            React.createElement("input", {
                className: "form-control",
                type: "text", value: coupon,
                onChange: e => onChange(e),
                placeholder: "Enter coupon code" })
        ),
        React.createElement(
            "button",
            { className: "btn btn-primary", onClick: e => submit(e) },
            "Submit"
        )
    );
}

export default Coupon;