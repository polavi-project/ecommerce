import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import A from "../../../../../../../../js/production/a.js";

export default function ProductEditFormComponent(props) {
    return <div>
        <Area id="admin_product_edit_before" widgets={[]}/>
        <Form id={"product-edit-form"} {...props} submitText={null}>
            <div className="form-head sticky">
                <div className="child-align-middle">
                    <A url={props.listUrl} className="">
                        <i className="fas fa-arrow-left"></i>
                        <span className="pl-1">Product list</span>
                    </A>
                </div>
                <div className="buttons">
                    <A className="btn btn-danger" url={props.cancelUrl}>Cancel</A>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </div>
            <div className="row">
                <Area id="admin_product_edit_inner_left" coreWidgets={[]} className="col-8"/>
                <Area id="admin_product_edit_inner_right" coreWidgets={[]} className="col-4"/>
            </div>
        </Form>
        <Area id="admin_product_edit_after" widgets={[]}/>
    </div>
}