import { Fetch } from "../../../../../../js/production/fetch.js";

export default function Cod(props) {
    const cartTotal = ReactRedux.useSelector(state => _.get(state, 'appState.cart.subTotal', 0));

    const [checked, setChecked] = React.useState(false);
    let status = parseInt(_.get(props, 'status'));
    let label = _.get(props, 'label');
    let min = parseFloat(_.get(props, 'minTotal'));
    let max = parseFloat(_.get(props, 'maxTotal'));
    if (status === 0 || min > cartTotal || max < cartTotal) return null;

    const onComplete = response => {
        if (response.success === 1) setChecked(true);
    };

    const onChange = e => {
        e.preventDefault();
        Fetch(props.apiUrl, false, "POST", { method_code: "cod", method_name: _.get(props, 'label', 'Cash on delivery') }, null, onComplete);
    };

    return React.createElement(
        'div',
        null,
        React.createElement(
            'label',
            { htmlFor: "cod-payment-method" },
            React.createElement('input', {
                type: "radio",
                name: "payment_method",
                id: "cod-payment-method",
                value: "cod",
                className: 'uk-radio',
                onChange: e => onChange(e),
                checked: checked
            }),
            label
        )
    );
}