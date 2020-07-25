import Area from "../../../../../../js/production/area.js";

export default function Header({ id, className }) {
    return React.createElement(
        "div",
        { className: className },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-4" },
                    React.createElement(Area, { id: "header_left", className: "d-flex justify-content-start" })
                ),
                React.createElement(
                    "div",
                    { className: "col-4" },
                    React.createElement(Area, { id: "header_center", className: "d-flex justify-content-center" })
                ),
                React.createElement(
                    "div",
                    { className: "col-4" },
                    React.createElement(Area, { id: "header_right", className: "d-flex justify-content-end" })
                )
            )
        )
    );
}