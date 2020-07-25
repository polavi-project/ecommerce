import Area from "../../../../../../js/production/area.js";

export default function Content({ id, className }) {
    return React.createElement(
        "div",
        { className: className },
        React.createElement(Area, { id: id, className: "row" })
    );
}