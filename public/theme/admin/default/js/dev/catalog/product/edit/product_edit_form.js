import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"

export default function ProductEditFormComponent(props) {
    return <div>
        <Area id="admin_product_edit_before" widgets={[]}/>
        <Form id={"product-edit-form"} {...props}>
            <Area id="admin_product_edit_inner" widgets={[]}/>
        </Form>
        <Area id="admin_product_edit_after" widgets={[]}/>
    </div>
}