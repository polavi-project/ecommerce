import Select from "../../../../../../../js/production/formelements/select.js";
import reducerRegistry from "../../../../../../../js/production/reducer_registry.js";

class DiscountType extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = e => {
            e.preventDefault();
            const { dispatch } = this.props;
            dispatch({
                type: "PROMOTION_EDIT_DISCOUNT_TYPE",
                discount_type: e.target.value
            });
        };
    }

    render() {
        return React.createElement(
            "div",
            { className: "promotion-edit-discount-type group-form" },
            React.createElement(
                "div",
                { className: "group-form-title" },
                React.createElement(
                    "span",
                    null,
                    "Discount Type"
                )
            ),
            React.createElement(Select, {
                name: "discount_type",
                value: 1,
                options: [{
                    'value': 'fixed_discount_to_entire_order',
                    'text': 'Fixed discount to entire order'
                }, {
                    'value': 'percentage_discount_to_entire_order',
                    'text': 'Percentage discount to entire order'
                }, {
                    'value': 'fixed_discount_to_specific_products',
                    'text': 'Fixed discount to specific products'
                }, {
                    'value': 'percentage_discount_to_specific_products',
                    'text': 'Percentage discount to specific products'
                }, {
                    'value': 'by_x_get_y',
                    'text': 'By X get Y'
                }],
                handler: this.onChange
            })
        );
    }
}
function reducer(state = 0, action = {}) {
    if (action.type === "PROMOTION_EDIT_DISCOUNT_TYPE") {
        return action.discount_type;
    }
    return state;
}
reducerRegistry.register('promotion_edit_discount_type', reducer);
export default ReactRedux.connect()(DiscountType);