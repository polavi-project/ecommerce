const Attributes = ({ attributes, areaProps }) => {

    React.useEffect(() => {
        areaProps.registerTab({ name: "Specification", id: "specification" });
    }, []);

    return areaProps.currentTab == "specification" ? React.createElement(
        "div",
        { className: "specification" },
        React.createElement(
            "ul",
            { className: "list-basic" },
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
    ) : null;
};
export default Attributes;