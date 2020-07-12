import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";

export default function CategoryEditForm(props) {
    return <div>
        <Area id="admin_category_edit_before" coreWidgets={[]}/>
        <Form id={"category-edit-form"} {...props} submitText={null}>
            <div className="form-head sticky">
                <div className="child-align-middle">
                    <A url={props.listUrl} className="">
                        <i className="fas fa-arrow-left"></i>
                        <span className="pl-1">Category list</span>
                    </A>
                </div>
                <div className="buttons">
                    <A className="btn btn-danger" url={props.cancelUrl}>Cancel</A>
                    <a href="javascript:void(0)" onClick={()=>document.getElementById('category-edit-form').dispatchEvent(new Event('submit'))} className="btn btn-primary">Submit</a>
                </div>
            </div>
            <div className="row">
                <Area id="admin_category_edit_inner_left" coreWidgets={[]} className="col-4"/>
                <Area id="admin_category_edit_inner_right" coreWidgets={[]} className="col-8"/>
            </div>
        </Form>
        <Area id="admin_category_edit_after" coreWidgets={[]}/>
    </div>
}