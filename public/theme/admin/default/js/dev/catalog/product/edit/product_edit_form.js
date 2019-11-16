import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"

export default function ProductEditFormComponent(props) {
    return <div>
        <Area id="admin_product_edit_before" widgets={[]}/>
        <Form id={"product-edit-form"} {...props}>
            <div className="uk-grid uk-grid-small">
                <Area id="admin_product_edit_inner_left" coreWidgets={[]} className="uk-width-1-2"/>
                <Area id="admin_product_edit_inner_right" coreWidgets={[]} className="uk-width-1-2"/>
            </div>
        </Form>
        <Area id="admin_product_edit_after" widgets={[]}/>
    </div>
}