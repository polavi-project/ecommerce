import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Tinycme from "../../../../../../../../js/production/form/fields/tinycme.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";

function General({id, name, content, layout, status}) {
    return <div>
        <Area id="admin-page-edit-general" coreWidgets={[
            {
                component: Text,
                props : {id : 'name', value: name, formId: "page-edit-form", name: "variables[page][name]", label: "Name", validation_rules:["notEmpty"]},
                sort_order: 10,
                id: "name"
            },
            {
                component: Tinycme,
                props : {id : 'content', value: content, formId: "page-edit-form", name: "variables[page][content]", label: "Content"},
                sort_order: 20,
                id: "content"
            },
            {
                component: Select,
                props : {id : 'status', value: status, formId: "page-edit-form", name: "variables[page][status]", type: "select", label: "Status", options:[{value:0, text:'Disabled'}, {value:1, text:'Enabled'}], isTranslateAble:false},
                sort_order: 30,
                id: "status"
            },
            {
                component: Select,
                props : {id : 'layout', value: layout, formId: "page-edit-form", name: "variables[page][layout]", label: "Status", options:[{value:'oneColumn', text:'One column'}, {value:'twoColumnLeft', text:'Two columns left'}, {value:'twoColumnRight', text:'Two columns right'}, {value:'threeColumn', text:'Three columns'}], isTranslateAble:false},
                sort_order: 40,
                id: "layout"
            }
        ]}/>
        {id && <input readOnly type="text" name="variables[page][id]" value={id} style={{
            display: 'none'
        }}/> }
    </div>
}

function SEO({seo_key, meta_keywords, meta_title, meta_description}) {
    return <Area id="admin-page-edit-seo" coreWidgets={[
        {
            component: Text,
            props : {id : 'seo_key', value: seo_key, formId: "page-edit-form", name: "variables[page][url_key]", label: "Url key", validation_rules:["notEmpty"]},
            sort_order: 10,
            id: "seo_key"
        },
        {
            component: Text,
            props : {id : 'meta_keywords', value: meta_keywords, formId: "page-edit-form", name: "variables[page][meta_keywords]", label: "Meta keywords"},
            sort_order: 20,
            id: "meta_keywords"
        },
        {
            component: Text,
            props : {id : 'meta_title', value: meta_title, formId: "page-edit-form", name: "variables[page][meta_title]", label: "Meta title"},
            sort_order: 30,
            id: "meta_title"
        },
        {
            component: Text,
            props : {id : 'meta_description', value: meta_description, formId: "page-edit-form", name: "variables[page][meta_description]", label: "Meta description"},
            sort_order: 40,
            id: "meta_description"
        }
    ]}/>
}
export default function PageEditFormComponent(props) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = (response) => {
        if(_.get(response, 'payload.data.createCmsPage.status') === true)
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "cms_page_update_success", message: 'Page has been saved successfully', type: "success"}]}});
        else
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "cms_page_update_error", message: _.get(response, 'payload.data.createCmsPage.message', 'Something wrong, please try again'), type: "error"}]}});
    };
    return <div>
        <Form
            id={"page-edit-form"}
            onComplete={onComplete}
              {...props}>
            <input type='text' name="query" value="mutation CreateCMSPage($page: CmsPageInput!) { createCmsPage (page: $page) {status message}}" readOnly style={{display:'none'}}/>
            <Area id="admin-page-edit-form-inner" coreWidgets={[
                {
                    component: General,
                    props : {
                        ...props
                    },
                    sort_order: 10,
                    id: "page-edit-general"
                },
                {
                    component: SEO,
                    props : {
                        ...props
                    },
                    sort_order: 20,
                    id: "page-edit-seo"
                }
            ]}/>
        </Form>
    </div>
}