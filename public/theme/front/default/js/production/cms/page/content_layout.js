import Area from "../../../../../../../js/production/area.js";

export default function ContentLayout() {
    return React.createElement(
        "div",
        { className: "uk-width-expand" },
        React.createElement(Area, {
            id: "content",
            className: "uk-grid uk-grid-small"
        })
    );
}