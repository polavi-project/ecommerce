import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import {ADD_APP_STATE} from "../../../../../../../../js/production/event-types.js";

export default function Inventory({data}) {
    const dispatch = ReactRedux.useDispatch();
    const [fields] = React.useState(() => {
        return [
            {
                component: Switch,
                props : {id : "manage_stock", formId: "product-edit-form",name: "manage_stock", label: "Manage stock?", options:[{value:0, text:'No'}, {value:1, text:'Yes'}], isTranslateAble:false},
                sort_order: 10,
                id: "manage_stock"
            },
            {
                component: Text,
                props : {
                    id : "qty",
                    formId: "product-edit-form",
                    name: "qty",
                    type: "text",
                    label: "Quantity",
                    validation_rules:["notEmpty", "integer"],
                    isTranslateAble:false,
                    handler: (e) => {
                        dispatch({'type': ADD_APP_STATE, 'payload': {appState: {currentQty: e.target.value}}});
                    }
                },
                sort_order: 20,
                id: "qty"
            },
            {
                component: Switch,
                props : {id : "stock_availability", formId: "product-edit-form", name: "stock_availability", label: "Stock availability", options:[{value:0, text:'Out of stock'}, {value:1, text:'In stock'}], validation_rules:["notEmpty"], isTranslateAble:false},
                sort_order: 30,
                id: "stock_availability"
            }
        ].filter((f) => {
            if(_.get(data, f.props.name) !== undefined)
                f.props.value = _.get(data, f.props.name);
            return f;
        });
    });

    return <div className="product-edit-inventory sml-block mt-4">
        <div className="sml-block-title">Inventory</div>
        <Area id="product-edit-inventory" coreWidgets={fields}/>
    </div>
}