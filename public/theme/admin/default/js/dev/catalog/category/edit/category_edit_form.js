import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"

export default function CategoryEditFormComponent(props) {
    return <div className="uk-width-1-3">
        <Area id="admin_category_edit_before" widgets={[]}/>
        <Form id={"category-edit-form"} {...props}>
            <Area id="admin_category_edit_inner" widgets={[]}/>
        </Form>
        <Area id="admin_category_edit_after" widgets={[]}/>
    </div>
}