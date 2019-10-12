import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function CheckoutButton({ action, cartId }) {

    const onClick = e => {
        e.preventDefault();
        Fetch(action, false, 'POST', { cartId: cartId });
    };

    return React.createElement(
        "div",
        { className: "checkout-button" },
        React.createElement(
            "a",
            { href: "#", onClick: e => onClick(e), className: "uk-button uk-button-small" },
            React.createElement(
                "span",
                null,
                "Place order"
            )
        )
    );
}