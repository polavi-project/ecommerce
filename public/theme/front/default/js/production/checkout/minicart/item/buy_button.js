import Fetch from "../../../../../../../../js/production/fetch.js";

class BuyButton extends React.Component {
    constructor(props) {
        super(props);
        // const {options} = this.props;
        // options.forEach((option) => {
        //     if(option.is_required === "1")
        //         this.props.dispatch({
        //             type: "ADD_VALIDATION_RULE",
        //             field_name: "option[" + option.product_custom_option_id + "]",
        //             callback: function(value) {
        //                 if(value === '')
        //                     return false;
        //             },
        //             message: "This is required field"
        //         });
        // });
    }

    onAddToCart(e, product_id) {
        e.preventDefault();
        const { dispatch } = this.props;
        Fetch(dispatch, window.base_url + "checkout/cart/add/" + product_id, false, "POST");
    }

    render() {
        const { product_id } = this.props;
        return React.createElement(
            "div",
            { className: "add-to-cart" },
            React.createElement(
                "a",
                { className: "uk-button uk-button-primary uk-button-small", onClick: e => this.onAddToCart(e, product_id) },
                React.createElement(
                    "span",
                    null,
                    "Add to cart"
                )
            )
        );
    }
}
export default ReactRedux.connect()(BuyButton);