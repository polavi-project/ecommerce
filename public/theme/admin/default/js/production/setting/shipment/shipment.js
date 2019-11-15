import Area from "../../../../../../../js/production/area.js";

export default function Shipment() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Shipment methods"
            )
        ),
        React.createElement(Area, {
            id: "shipment-setting",
            className: "uk-grid-small uk-grid"
        })
    );
}