const Attributes = ({ attributes }) => {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "strong",
            null,
            "Attributes"
        ),
        React.createElement("br", null),
        React.createElement(
            "ul",
            null,
            attributes.map((attribute, index) => {
                return React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "strong",
                        null,
                        attribute.attribute_name,
                        " : "
                    ),
                    " ",
                    React.createElement(
                        "span",
                        null,
                        attribute.attribute_value_text
                    )
                );
            })
        )
    );
};
export default Attributes;