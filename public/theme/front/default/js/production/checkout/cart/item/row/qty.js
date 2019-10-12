var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Fetch from "../../../../../../../../../js/production/fetch.js";

class Qty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qty: props.qty,
            active: false
        };
    }

    onChange(e) {
        e.preventDefault();
        this.setState({
            active: true,
            qty: e.target.value
        });
    }

    onClick(e) {
        e.preventDefault();
        const { dispatch, item_id } = this.props;
        Fetch(dispatch, window.base_url + "cart/item/update/" + item_id, false, "POST", { qty: this.state.qty });
        this.setState(_extends({}, this.state, {
            active: false
        }));
    }

    render() {
        const { qty } = this.props;
        return React.createElement(
            "td",
            { id: this.props.id },
            React.createElement("input", { type: "text", defaultValue: qty, className: "uk-input", onChange: e => this.onChange(e) }),
            React.createElement(
                "button",
                { style: { display: this.state.active ? 'block' : 'none' }, className: "uk-button-small uk-button uk-button-primary", onClick: e => this.onClick(e) },
                "Update"
            )
        );
    }
}

export default ReactRedux.connect()(Qty);