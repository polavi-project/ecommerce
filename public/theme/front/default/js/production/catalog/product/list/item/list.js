import Price from "./price.js";

class Products extends React.Component {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     let current_widgets = this.props.widgets;
    //     let new_widgets = nextProps.widgets;
    //     var keys_old = Object.keys(current_widgets);
    //     var keys_new = Object.keys(new_widgets);
    //     if (keys_old.length !== keys_new.length)
    //         return true;
    //     for (var i = 0; i < keys_old.length; i++) {
    //         if (current_widgets[keys_old[i]]['id'] !== new_widgets[keys_new[i]]['id'])
    //             return true;
    //     }
    //     return false;
    // }


    render() {
        const { products } = this.props;
        return React.createElement(
            "div",
            { className: "product-list" },
            React.createElement(
                "ul",
                null,
                products.map((product, index) => {
                    return React.createElement(
                        "li",
                        { key: index },
                        React.createElement(
                            "h3",
                            { className: "product-name" },
                            product.name
                        ),
                        product.final_price < product.price && React.createElement(Price, {
                            price: product.price,
                            classes: "price regular-price strike-through"
                        }),
                        product.final_price === product.price && React.createElement(Price, {
                            price: product.price,
                            classes: "price regular-price"
                        }),
                        product.final_price < product.price && React.createElement(Price, {
                            price: product.final_price,
                            classes: "price final-price"
                        })
                    );
                })
            )
        );
    }
}
export default ReactRedux.connect()(Products);