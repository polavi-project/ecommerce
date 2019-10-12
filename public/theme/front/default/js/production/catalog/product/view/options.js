import Select from "../../../../../../../../js/production/formelements/select.js";
import MultiSelect from "../../../../../../../../js/production/formelements/multiselect.js";

class Options extends React.Component {
    constructor(props) {
        super(props);
        const { options } = this.props;
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

    render() {
        const { options, error } = this.props;
        return React.createElement(
            "div",
            { className: "options custom-options" },
            React.createElement(
                "strong",
                null,
                "Options"
            ),
            React.createElement("br", null),
            React.createElement(
                "ul",
                { className: "option-list" },
                options.map((option, index) => {
                    let data = {
                        id: "custom_option_" + index,
                        name: "custom_options[" + option.product_custom_option_id + "]",
                        label: option.option_name,
                        options: option.values
                    };
                    if (option.is_required === "1") data.validation_rules = ["required"];
                    switch (option.option_type) {
                        case 'select':
                            return React.createElement(
                                "li",
                                { key: index },
                                React.createElement(Select, data)
                            );
                        case 'multiselect':
                            return React.createElement(
                                "li",
                                { key: index },
                                React.createElement(MultiSelect, data)
                            );
                        default:
                            return React.createElement(
                                "li",
                                { key: index },
                                React.createElement(Select, data)
                            );
                    }
                })
            )
        );
    }
}
// TODO: show validation error for option
const mapStateToProps = (state, ownProps) => {
    return {
        error: state.form_validation_errors['qty']
    };
};
export default ReactRedux.connect(mapStateToProps)(Options);