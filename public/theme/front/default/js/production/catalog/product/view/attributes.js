const Attributes = ({ attributes }) => {
    return React.createElement(
        "li",
        null,
        React.createElement(
            "a",
            { className: "uk-accordion-title", href: "#" },
            "Specification"
        ),
        React.createElement(
            "ul",
            { className: "uk-accordion-content" },
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