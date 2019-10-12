import Text from "../../../../../../../js/production/formelements/text.js";
import Select from "../../../../../../../js/production/formelements/select.js";

class DefaultAddress extends React.Component {
    constructor(props) {
        super(props);

        this.onChangeCountry = e => {
            this.setState({
                country: e.target.value
            });
        };

        this.state = {
            country: this.props.country
        };
    }

    render() {
        const { region, postcode, countries, regions } = this.props;
        return React.createElement(
            "div",
            { className: "uk-overflow-auto" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "Default address for tax calculation"
                )
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(Select, {
                    name: "sale_default_tax_country",
                    value: this.state.country,
                    options: countries,
                    handler: this.onChangeCountry.bind(this)
                })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(Select, {
                    name: "sale_default_tax_region",
                    value: region,
                    options: regions[this.state.country]
                })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(Text, { name: "sale_default_tax_postcode", value: postcode })
            )
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let error = [];
    for (var key in state.form_validation_errors) {
        if (state.form_validation_errors.hasOwnProperty(key) && key.indexOf('tax_rate') !== -1) {
            error[key] = state.form_validation_errors[key];
        }
    }
    return {
        error
    };
};
// TODO: Validation error for advance price form
export default ReactRedux.connect(mapStateToProps)(DefaultAddress);