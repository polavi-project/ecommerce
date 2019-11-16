var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";
import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import { ADD_ALERT } from "../../../../../../../js/production/event-types.js";

function Group({ group, selectGroup, removeGroup, updateGroup }) {
    const [onEdit, setOnEdit] = React.useState(false);

    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            React.createElement("input", { className: "uk-radio", type: "radio", checked: group.isChecked === true, onChange: () => {
                    selectGroup(group.id);
                } })
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "div",
                { style: { width: '200px' } },
                onEdit === true && React.createElement("input", { className: "uk-input uk-form-small", type: "text", defaultValue: group.name, onKeyDown: e => {
                        if (e.target.value.trim() && e.which === 13) {
                            e.preventDefault();updateGroup(group.id, e.target.value.trim());setOnEdit(false);
                        }
                    } }),
                onEdit === false && React.createElement(
                    "span",
                    { onDoubleClick: e => {
                            e.preventDefault();setOnEdit(true);
                        } },
                    group.name
                )
            )
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "div",
                { style: { width: '20px' } },
                parseInt(group.id) !== 1 && React.createElement(
                    "a",
                    { href: "#", onClick: () => {
                            removeGroup(group.id);
                        } },
                    React.createElement("span", { "uk-icon": "icon: close; ratio: 0.8" })
                )
            )
        )
    );
}

function Groups({ _groups, _selectedGroup }) {
    const dispatch = ReactRedux.useDispatch();

    const [groups, setGroups] = React.useState(() => {
        return _groups.map(g => {
            g.isChecked = parseInt(g.id) === parseInt(_selectedGroup);

            return g;
        });
    });
    const [group, setGroup] = React.useState(_selectedGroup);
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const addGroup = name => {
        Fetch(api, false, 'POST', {
            query: "mutation { createCustomerGroup (name: \"" + name + "\") {status group {id:customer_group_id name:group_name}}}"
        }, null, response => {
            if (_.get(response, 'payload.data.createCustomerGroup.status') === true) {
                setGroups(groups.concat(_.get(response, 'payload.data.createCustomerGroup.group')));
            }
        }, () => {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "create_customer_group_error", message: 'Something wrong, please try again', type: "error" }] } });
        });
    };

    const updateGroup = (id, name) => {
        Fetch(api, false, 'POST', {
            query: "mutation { updateCustomerGroup (id: " + id + " name: \"" + name + "\") {status group {id:customer_group_id name:group_name}}}"
        }, null, response => {
            if (_.get(response, 'payload.data.updateCustomerGroup.status') === true) {
                setGroups(groups.map(g => {
                    if (parseInt(g.id) === parseInt(_.get(response, 'payload.data.updateCustomerGroup.group.id'))) g.name = _.get(response, 'payload.data.updateCustomerGroup.group.name');

                    return g;
                }));
            }
        }, () => {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "update_customer_group_error", message: 'Something wrong, please try again', type: "error" }] } });
        });
    };

    const removeGroup = id => {
        Fetch(api, false, 'POST', {
            query: "mutation { deleteCustomerGroup (id: " + id + ") {status}}"
        }, null, response => {
            if (_.get(response, 'payload.data.deleteCustomerGroup.status') === true) {
                setGroups(groups.filter(g => {
                    return parseInt(g.id) !== parseInt(id);
                }));
            }
        });
    };

    const selectGroup = id => {
        setGroups(groups.map(g => {
            g.isChecked = parseInt(g.id) === parseInt(id);

            return g;
        }));
        setGroup(id);
    };

    return React.createElement(
        "div",
        { className: "form-field" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Customer group"
            )
        ),
        React.createElement(
            "table",
            { className: "uk-table-small uk-table" },
            React.createElement(
                "tbody",
                null,
                groups.map((g, i) => {
                    return React.createElement(Group, { key: i, group: g, selectGroup: selectGroup, removeGroup: removeGroup, updateGroup: updateGroup });
                }),
                React.createElement(
                    "tr",
                    null,
                    React.createElement("td", null),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "div",
                            { style: { width: '200px' } },
                            React.createElement("input", { className: "uk-input uk-form-small", type: "text", onKeyDown: e => {
                                    if (e.target.value.trim() && e.which === 13) {
                                        e.preventDefault();addGroup(e.target.value.trim());
                                    }
                                }, placeholder: "Add new group" })
                        )
                    ),
                    React.createElement("td", null)
                )
            )
        ),
        React.createElement("input", { type: "hidden", name: "variables[customer][group_id]", value: group, readOnly: true })
    );
}

function CustomerInfo(props) {
    const dispatch = ReactRedux.useDispatch();
    const action = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Customer edit"
            )
        ),
        React.createElement(
            Form,
            _extends({}, props, {
                id: "customer-edit-form",
                action: action,
                onComplete: response => {
                    if (_.get(response, 'payload.data.updateCustomer.status') === true) {
                        location.reload();
                    } else {
                        dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "customer_update_error", message: _.get(response, 'payload.data.updateCustomer.message', 'Something wrong, please try again'), type: "error" }] } });
                    }
                }
            }),
            React.createElement("input", { type: "hidden", name: "variables[customer][customer_id]", value: props.customer.customer_id, readOnly: true }),
            React.createElement("input", { type: "text", name: "query", value: "mutation UpdateCustomer($customer: updateCustomerInput!) { updateCustomer (customer: $customer) {status message}}", readOnly: true, style: { display: 'none' } }),
            React.createElement(Area, { id: "admin_customer_edit_inner", coreWidgets: [{
                    'component': Text,
                    'props': {
                        name: "variables[customer][full_name]",
                        value: props.customer.full_name,
                        formId: "customer-edit-form",
                        label: "Full name",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 10,
                    'id': 'full_name'
                }, {
                    'component': Text,
                    'props': {
                        name: "variables[customer][email]",
                        value: props.customer.email,
                        formId: "customer-edit-form",
                        label: "Email",
                        validation_rules: ['notEmpty', 'email']
                    },
                    'sort_order': 20,
                    'id': 'email'
                }, {
                    'component': Groups,
                    'props': { _groups: props.groups, _selectedGroup: props.customer.group_id },
                    'sort_order': 30,
                    'id': 'group'
                }, {
                    'component': Password,
                    'props': {
                        name: "variables[customer][password]",
                        value: "",
                        formId: "customer-edit-form",
                        label: "New password",
                        validation_rules: []
                    },
                    'sort_order': 50,
                    'id': 'password'
                }] })
        )
    );
}
export default function CustomerEditFormComponent(props) {
    return React.createElement(Area, {
        id: "admin_customer_edit_inner",
        className: "uk-grid uk-grid-small",
        coreWidgets: [{
            component: CustomerInfo,
            props: _extends({}, props),
            sort_order: 10,
            id: "customer_info"
        }] });
}