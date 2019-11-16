import Area from "../../../../../../../js/production/area.js";

export default function Payment() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Payment methods"
            )
        ),
        React.createElement(Area, {
            id: "payment-setting",
            className: "uk-grid-small uk-grid"
        })
    );
}