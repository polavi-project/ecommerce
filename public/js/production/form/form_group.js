import Area from "./../area.js";

function FormGroup({ id, name }) {
        return React.createElement(
                "div",
                { id: id, className: id + "-content-inner group-form" },
                React.createElement(
                        "div",
                        { className: "group-form-title" },
                        React.createElement(
                                "span",
                                null,
                                name
                        )
                ),
                React.createElement(Area, { id: id, widgets: [] })
        );
}

export default FormGroup;