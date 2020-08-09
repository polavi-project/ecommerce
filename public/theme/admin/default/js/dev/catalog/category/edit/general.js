import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Tinycme from "../../../../../../../../js/production/form/fields/ckeditor.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

let fields = [
    {
        component: Text,
        props : {id : 'name', formId: "category-edit-form", name: "name", label: "Name", validation_rules:["notEmpty"]},
        sort_order: 10,
        id: "name"
    },
    {
        component: Switch,
        props : {id : 'status', formId: "category-edit-form", name: "status", label: "Status", isTranslateAble: false, validation_rules:["notEmpty"]},
        sort_order: 20,
        id: "status"
    },
    {
        component: Tinycme,
        props : {id : 'description', formId: "category-edit-form", name: "description", label: "Description"},
        sort_order: 30,
        id: "description"
    },
    {
        component: Switch,
        props : {id : "include_in_nav", formId: "category-edit-form", name: "include_in_nav", label: "Include in navigation ?", isTranslateAble:false, validation_rules:["notEmpty"]},
        sort_order: 40,
        id: "include_in_nav"
    },
    {
        component: Text,
        props : {id : "position", formId: "category-edit-form", name: "position", type: "text", label: "Position", validation_rules:["integer"], isTranslateAble:false},
        sort_order: 50,
        id: "position"
    }
];

export default function General({data}) {
    React.useState(function() {
        fields.filter((f) => {
            if(_.get(data, f.props.name) !== undefined)
                f.props.value = _.get(data, f.props.name);
            return f;
        });
        return null
    });
    return <div className="category-edit-general sml-block">
        <div className="sml-block-title">General</div>
        <Area id="category-edit-general" coreWidgets={fields}/>
    </div>
}