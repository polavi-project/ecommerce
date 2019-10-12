import Area from "../../../../../../../js/production/area.js";

export default function PaymentBlock(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            "Payment methods"
        ),
        React.createElement(Area, {
            id: "payment_block",
            widgets: []
        })
    );
}