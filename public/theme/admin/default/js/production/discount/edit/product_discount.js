import Text from "../../../../../../../js/production/formelements/text.js";

class ProductDiscount extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { discount_type } = this.props;
        if (parseInt(discount_type) !== 2 || parseInt(discount_type) !== 3) {
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
                        "List of target product"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "" },
                    React.createElement(
                        "span",
                        null,
                        "Conditions"
                    )
                ),
                React.createElement(Text, {
                    name: "conditions[sub_total]",
                    label: "Minimum purchase amount"
                }),
                React.createElement(Text, {
                    name: "conditions[qty]",
                    label: "Minimum purchase qty"
                }),
                React.createElement(
                    "div",
                    { className: "" },
                    React.createElement(
                        "span",
                        null,
                        "Products"
                    )
                )
            );
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return { discount_type: state.discount_type };
};
export default ReactRedux.connect(mapStateToProps)(ProductDiscount);