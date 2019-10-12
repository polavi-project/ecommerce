const Product = ({ id, name, sku, custom_options }) => React.createElement(
    "td",
    null,
    React.createElement(
        "p",
        null,
        name
    ),
    React.createElement(
        "p",
        null,
        "Sku: ",
        sku
    ),
    React.createElement(
        "div",
        null,
        custom_options.map((option, index) => {
            return React.createElement(
                "p",
                { key: index },
                option.option_name,
                " : ",
                option.value
            );
        })
    )
);

export default Product;