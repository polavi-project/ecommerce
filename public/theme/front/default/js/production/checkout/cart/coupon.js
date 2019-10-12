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
        { className: "shopping-cart-coupon uk-width-1-4" },
        React.createElement(
            "p",
            null,
            React.createElement(
                "strong",
                null,
                "Coupon code"
            )
        ),
        React.createElement(
            "div",
            { className: "uk-margin" },
            React.createElement("input", {
                className: "uk-input uk-form-width-medium uk-form-small",
                type: "text", value: coupon,
                onChange: e => onChange(e),
                placeholder: "Enter coupon code" })
        ),
        React.createElement(
            "button",
            { className: "uk-button uk-button-primary", onClick: e => submit(e) },
            "Submit"
        )
    );
}

export default Coupon;