import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"

export default function CategoryEditForm(props) {
    return <div className="category-edit-container">
        <Area id="admin_category_edit_before" widgets={[]}/>
        <Form id={"category-edit-form"} {...props}>
            <div className="uk-grid uk-grid-small">
                <Area id="admin_category_edit_inner_left" widgets={[]} className="uk-width-1-2"/>
                <Area id="admin_category_edit_inner_right" widgets={[]} className="uk-width-1-2"/>
            </div>
        </Form>
        <Area id="admin_category_edit_after" widgets={[]}/>
    </div>
}