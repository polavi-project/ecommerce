var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import { REQUEST_END } from "../../../../../../../js/production/event-types.js";
import { ReducerRegistry } from "../../../../../../../js/production/reducer_registry.js";

const mapStateToProps = (state, ownProps) => {
    return state.customerInfo.email ? state.customerInfo : ownProps;
};

function infoReducer(info = {}, action = {}) {
    if (action.type === REQUEST_END && action.updateCustomer) {
        return action.updateCustomer.customer;
    }
    return info;
}

ReducerRegistry.register('customerInfo', infoReducer);

function EditForm(props) {
    return React.createElement(
        Form,
        _extends({ id: "customer-info-form" }, props),
        React.createElement(Area, {
            id: "customer-info-form-inner",
            coreWidgets: [{
                'component': Text,
                'props': {
                    name: "full_name",
                    value: props.full_name,
                    formId: "customer-info-form",
                    label: "First name",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 10,
                'id': 'full_name'
            }, {
                'component': Text,
                'props': {
                    name: "email",
                    value: props.email,
                    formId: "customer-info-form",
                    label: "Email",
                    validation_rules: ['notEmpty', 'email']
                },
                'sort_order': 30,
                'id': 'email'
            }, {
                'component': Password,
                'props': {
                    name: "password",
                    value: "",
                    formId: "customer-info-form",
                    label: "New password",
                    validation_rules: []
                },
                'sort_order': 40,
                'id': 'password'
            }]
        })
    );
}

function Info(props) {
    const [editing, setEditing] = React.useState(false);

    const [token, setToken] = React.useState(function () {
        return PubSub.subscribe(REQUEST_END, function (message, data) {
            if (data.updateCustomer) setEditing(false);
        });
    });

    React.useEffect(() => {
        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    return React.createElement(
        "div",
        { className: "uk-grid-small uk-width-1-2@m" },
        React.createElement(
            "h2",
            null,
            "Customer information"
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Full name"
            ),
            " : ",
            props.full_name
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Email"
            ),
            " : ",
            props.email
        ),
        !editing && React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: e => {
                        e.preventDefault();setEditing(true);
                    } },
                "Edit"
            )
        ),
        editing && React.createElement(
            "div",
            null,
            React.createElement(EditForm, props),
            React.createElement(
                "a",
                { href: "#", onClick: e => {
                        e.preventDefault();setEditing(false);
                    } },
                "Cancel"
            )
        )
    );
}

export default ReactRedux.connect(mapStateToProps)(Info);