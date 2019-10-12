import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function CheckoutButton({ action, cartId }) {

    const onClick = e => {
        e.preventDefault();
        Fetch(action, false, 'POST', { cartId: cartId });
    };

    return React.createElement(
        "tr",
        null,
        React.createElement("td", null),
        React.createElement(
            "td",
            null,
            React.createElement(
                "div",
                { className: "checkout-button" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => onClick(e), className: "uk-button uk-button-small uk-button-primary" },
                    React.createElement(
                        "span",
                        null,
                        "Place order"
                    )
                )
            )
        )
    );
}