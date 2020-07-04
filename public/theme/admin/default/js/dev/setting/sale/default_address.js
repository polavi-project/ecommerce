import Text from "../../../../../../../js/production/formelements/text.js";
import Select from "../../../../../../../js/production/formelements/select.js";

class DefaultAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: this.props.country
        }
    }

    onChangeCountry = (e) => {
        this.setState({
            country: e.target.value
        });
    };

    render() {
        const {region, postcode, countries, regions} = this.props;
        return <div className="uk-overflow-auto">
            <div><strong>Default address for tax calculation</strong></div>
            <div className="form-group">
                <Select
                    name='sale_default_tax_country'
                    value={this.state.country}
                    options={countries}
                    handler={this.onChangeCountry.bind(this)}
                />
            </div>
            <div className="form-group">
                <Select
                    name='sale_default_tax_region'
                    value={region}
                    options={regions[this.state.country]}
                />
            </div>
            <div className="form-group">
                <Text name='sale_default_tax_postcode' value={postcode} />
            </div>
        </div>;
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