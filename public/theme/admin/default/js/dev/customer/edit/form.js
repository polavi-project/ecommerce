import Area from "../../../../../../../js/production/area.js";
import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import A from "../../../../../../../js/production/a.js";
import {REQUEST_END} from "../../../../../../../js/production/event-types.js";
import {ReducerRegistry} from "../../../../../../../js/production/reducer_registry.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import {Hidden} from "../../../../../../../js/production/form/fields.js";

function Gs(props) {
    const [group, setGroup] = React.useState(props.customer.group_id);
    const onClick = (e) => {
        e.preventDefault();
        e.persist();
        if(e.target.value.trim())
            Fetch(window.base_url + "/api/graphql", false, 'POST', {
                query: "mutation { createCustomerGroup (name: \"" + e.target.value.trim() + "\") {status group {id:customer_group_id name:group_name}}}"
            });
    };

    return <div>
        <ul className="uk-list">
            {
                props.groups.map((g,i) => {
                    return <li key={i}>
                        <a className="uk-link-muted" onClick={(e) => { e.preventDefault(); setGroup(g.id);}}><span>{g.name}</span></a>
                        {parseInt(group) === parseInt(g.id) && <span uk-icon="icon: check; ratio: 0.8"></span>}
                    </li>
                })
            }
            <li><input className="uk-input uk-form-small" type={"text"} onBlur={(e) => onClick(e)} placeholder={"Add new group"}/></li>
        </ul>
        <input type={"hidden"} name={"group_id"} value={group}/>
    </div>
}

const mapStateToProps = (state, ownProps) => {
    let groups = [];
    ownProps.groups.forEach((g,i) => {
        if(state.customerGroups.findIndex((e) => e.id === g.id) === -1)
            groups.push(g);
    });
    return {groups: groups.concat(state.customerGroups)};
};

function reducer(groups = [], action = {}) {
    if(
        action.type === REQUEST_END &&
        action.payload &&
        action.payload.success
    ) {
        if(action.payload.data.data.updateCustomerGroup !== undefined)
            return groups.map((g, i) => {
                if(g.id === action.payload.data.data.updateCustomerGroup.group.id)
                    g.name = action.payload.data.data.updateCustomerGroup.group.name;
                return g;
            });
        else if(action.payload.data.data.createCustomerGroup !== undefined)
            return groups.concat({
                name: action.payload.data.data.createCustomerGroup.group.name,
                id: action.payload.data.data.createCustomerGroup.group.id
            });
        else if(action.payload.data.data.removeCustomerGroup !== undefined)
            return groups.filter((_, index) => _.id !== action.payload.data.data.removeCustomerGroup.group.id);
        else
            return groups;
    }
    return groups;
}

ReducerRegistry.register('customerGroups', reducer);
const Groups = ReactRedux.connect(mapStateToProps)(Gs);

export default function CustomerEditFormComponent(props) {
    return <div>
        <Area id="admin_customer_edit_before" coreWidgets={[]}/>
        <Form {...props} id={"customer-edit-form"}>
            <Area id="admin_customer_edit_inner" coreWidgets={[
                {
                    'component': Groups,
                    'props': props,
                    'sort_order': 10,
                    'id': 'group'
                },
                {
                    'component': Text,
                    'props': {
                        name: "email",
                        value: props.customer.email,
                        formId: "customer-edit-form",
                        label: "Email",
                        validation_rules: ['notEmpty', 'email']
                    },
                    'sort_order': 20,
                    'id': 'email'
                },
                {
                    'component': Text,
                    'props': {
                        name: "full_name",
                        value: props.customer.full_name,
                        formId: "customer-edit-form",
                        label: "Full name",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 30,
                    'id': 'full_name'
                },
                {
                    'component': Password,
                    'props': {
                        name: "password",
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
        <Area id="admin_customer_edit_after" widgets={[]}/>
    </div>
}