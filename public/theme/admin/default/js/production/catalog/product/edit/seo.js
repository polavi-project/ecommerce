import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import TextArea from "../../../../../../../../js/production/form/fields/textarea.js";

export default function Seo({ data }) {
    const [fields] = React.useState(function () {
        return [{
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
        }].filter(f => {
            if (_.get(data, f.props.name) !== undefined) f.props.value = _.get(data, f.props.name);
            return f;
        });
    });

    return React.createElement(
        "div",
        { className: "product-edit-seo border-block" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "SEO"
            )
        ),
        React.createElement(Area, { id: "product-edit-seo", coreWidgets: fields })
    );
}