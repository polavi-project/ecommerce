import A from "../../../../../../../../../js/production/a.js";
const Name = ({ name, url }) => {
    return React.createElement(
        "div",
        { className: "product-name product-list-name" },
        React.createElement(
            A,
            { className: "", url: url },
            React.createElement(
                "span",
                null,
                name
            )
        )
    );
};
export { Name };