import Text from "../../../../../../../js/production/formelements/text.js";

class OrderDiscount extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { discount_type } = this.props;
        if (parseInt(discount_type) !== 0 || parseInt(discount_type) !== 1) {
            return null;
        } else {
            return React.createElement(
                "div",
                { className: "promotion-edit-discount-type group-form" },
                React.createElement(
                    "div",
                    { className: "group-form-title" },
                    React.createElement(
                        "span",
                        null,
                        "Order condition"
                    )
                ),
                React.createElement(Text, {
                    name: "conditions[order_total]",
                    label: "Minimum purchase amount"
                }),
                React.createElement(Text, {
                    name: "conditions[order_qty]",
                    label: "Minimum purchase qty"
                }),
                React.createElement(Text, {
                    name: "conditions[order_product]",
                    label: "Minimum purchase product"
                })
            );
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return { discount_type: state.discount_type };
};
export default ReactRedux.connect(mapStateToProps)(OrderDiscount);