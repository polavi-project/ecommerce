import Area from "../../../../../../../js/production/area.js";
import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import {ADD_ALERT} from "../../../../../../../js/production/event-types.js";
import Select from "../../../../../../../js/production/form/fields/select.js";

function Group({group, selectGroup, removeGroup, updateGroup}) {
    const [onEdit, setOnEdit] = React.useState(false);

    return <tr>
        <td>
            <input className="uk-radio" type="radio" checked={group.isChecked === true} onChange={() => {selectGroup(group.id)}}/>
        </td>
        <td>
            <div style={{width: '200px'}}>
                {onEdit === true && <input className="uk-input uk-form-small" type="text" defaultValue={group.name} onKeyDown={(e) => {if(e.target.value.trim() && e.which === 13 ) {e.preventDefault(); updateGroup(group.id, e.target.value.trim()); setOnEdit(false);}}}/>}
                {onEdit === false && <span onDoubleClick={(e) => {e.preventDefault(); setOnEdit(true);}}>{group.name}</span>}
            </div>
        </td>
        <td><div style={{width: '20px'}}>{parseInt(group.id) !== 1 && <a href="#" onClick={()=> {removeGroup(group.id);}}><span uk-icon="icon: close; ratio: 0.8"></span></a>}</div></td>
    </tr>
}

function Groups({_groups, _selectedGroup}) {
    const dispatch = ReactRedux.useDispatch();

    const [groups, setGroups] = React.useState(() => {
        return _groups.map((g)=> {
            g.isChecked = parseInt(g.id) === parseInt(_selectedGroup);

            return g;
        });
    });
    const [group, setGroup] = React.useState(_selectedGroup);
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const addGroup = (name) => {
        Fetch(
            api,
            false,
            'POST',
            {
                query: "mutation { createCustomerGroup (name: \"" + name + "\") {status group {id:customer_group_id name:group_name}}}"
            },
            null,
            (response) => {
                if(_.get(response, 'payload.data.createCustomerGroup.status') === true) {
                    setGroups(groups.concat(_.get(response, 'payload.data.createCustomerGroup.group')));
                }
            },
            () => {
                dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "create_customer_group_error", message: 'Something wrong, please try again', type: "error"}]}});
            }
        );
    };

    const updateGroup = (id, name) => {
        Fetch(
            api,
            false,
            'POST',
            {
                query: "mutation { updateCustomerGroup (id: " + id + " name: \"" + name + "\") {status group {id:customer_group_id name:group_name}}}"
            },
            null,
            (response) => {
                if(_.get(response, 'payload.data.updateCustomerGroup.status') === true) {
                    setGroups(groups.map((g) =>{
                        if(parseInt(g.id) === parseInt(_.get(response, 'payload.data.updateCustomerGroup.group.id')))
                            g.name = _.get(response, 'payload.data.updateCustomerGroup.group.name');

                        return g;
                    }));
                }
            },
            () => {
                dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "update_customer_group_error", message: 'Something wrong, please try again', type: "error"}]}});
            }
        );
    };

    const removeGroup = (id) => {
        Fetch(
            api,
            false,
            'POST',
            {
                query: "mutation { deleteCustomerGroup (id: " + id + ") {status}}"
            },
            null,
            (response) => {
                if(_.get(response, 'payload.data.deleteCustomerGroup.status') === true) {
                    setGroups(groups.filter((g) =>{
                        return parseInt(g.id) !== parseInt(id);
                    }));
                }
            }
        );
    };

    const selectGroup = (id) => {
        setGroups(groups.map((g) =>{
            g.isChecked = parseInt(g.id) === parseInt(id);

            return g;
        }));
        setGroup(id);
    };

    return <div className="form-field">
        <div><span>Customer group</span></div>
        <table className="uk-table-small uk-table">
            <tbody>
                {
                    groups.map((g,i) => {
                        return <Group key={i} group={g} selectGroup={selectGroup} removeGroup={removeGroup} updateGroup={updateGroup}/>
                    })
                }
                <tr>
                    <td></td>
                    <td>
                        <div style={{width: '200px'}}>
                            <input className="uk-input uk-form-small" type={"text"} onKeyDown={(e) => {if(e.target.value.trim()  && e.which === 13 ) {e.preventDefault(); addGroup(e.target.value.trim());}}} placeholder={"Add new group"}/>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <input type={"hidden"} name={"variables[customer][group_id]"} value={group} readOnly={true}/>
    </div>
}

function CustomerInfo(props) {
    const dispatch = ReactRedux.useDispatch();
    const action = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    return <div className="uk-width-1-2">
        <div><h2>Customer edit</h2></div>
        <Form
            {...props}
            id={"customer-edit-form"}
            action={action}
            onComplete = {(response)=> {
                if(_.get(response, 'payload.data.updateCustomer.status') === true) {
                    location.reload()
                } else {
                    dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "customer_update_error", message: _.get(response, 'payload.data.updateCustomer.message', 'Something wrong, please try again'), type: "error"}]}});
                }
            }}
        >
            <input type={"hidden"} name={"variables[customer][customer_id]"} value={props.customer.customer_id} readOnly={true}/>
            <input type='text' name="query" value="mutation UpdateCustomer($customer: updateCustomerInput!) { updateCustomer (customer: $customer) {status message}}" readOnly style={{display:'none'}}/>
            <Area id="admin_customer_edit_inner" coreWidgets={[
                {
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
                },
                {
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
                },
                {
                    'component': Select,
                    'props': {
                        name: "variables[customer][status]",
                        value: props.customer.status,
                        formId: "customer-edit-form",
                        label: "Is enabled?",
                        options: [{value: 1, text: 'Yes'}, {value: 0, text: 'No'}],
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 25,
                    'id': 'status'
                },
                {
                    'component': Groups,
                    'props': {_groups : props.groups, _selectedGroup: props.customer.group_id},
                    'sort_order': 30,
                    'id': 'group'
                },
                {
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
                }
            ]}/>
        </Form>
    </div>
}
export default function CustomerEditFormComponent(props) {
    return <Area
        id="admin_customer_edit_inner"
        className={"uk-grid uk-grid-small"}
        coreWidgets={[
            {
                component: CustomerInfo,
                props : {
                    ...props
                },
                sort_order: 10,
                id: "customer_info"
            }
        ]}/>
}