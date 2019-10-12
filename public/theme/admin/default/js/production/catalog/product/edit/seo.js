import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import TextArea from "../../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
let fields = [{
    component: Text,
    props: { id: 'seo_key', formId: "product-edit-form", name: "seo_key", label: "Url key", validation_rules: ["notEmpty"], isTranslateAble: true },
    sort_order: 10,
    id: "seo_key"
}, {
    component: Text,
    props: { id: 'meta_title', formId: "product-edit-form", name: "meta_title", label: "Meta title", validation_rules: ["notEmpty"], isTranslateAble: true },
    sort_order: 20,
    id: "meta_title"
}, {
    component: TextArea,
    props: { id: 'meta_description', formId: "product-edit-form", name: "meta_description", label: "Meta description", isTranslateAble: true },
    sort_order: 30,
    id: "meta_description"
}];

export default function Seo({ data }) {
    React.useState(function () {
        fields.filter(f => {
            if (_.get(data, f.props.name) !== undefined) f.props.value = _.get(data, f.props.name);
            return f;
        });
        return null;
    });
    return React.createElement(Area, { id: "product-edit-seo", coreWidgets: fields });
}