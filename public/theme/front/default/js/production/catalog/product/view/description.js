const Description = ({ description }) => {
    return React.createElement(
        "li",
        null,
        React.createElement(
            "a",
            { className: "uk-accordion-title", href: "#" },
            "Description"
        ),
        React.createElement(
            "div",
            { className: "uk-accordion-content" },
            description
        )
    );
};

export default Description;