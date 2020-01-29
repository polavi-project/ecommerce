import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";

export default function CategoryEditForm(props) {
    return <div>
        <Area id="admin_category_edit_before" coreWidgets={[]}/>
        <Form id={"category-edit-form"} {...props}>
            <div className="uk-grid uk-grid-small">
                <Area id="admin_category_edit_inner_left" coreWidgets={[]} className="uk-width-1-2"/>
                <Area id="admin_category_edit_inner_right" coreWidgets={[]} className="uk-width-1-2"/>
            </div>
        </Form>
        <Area id="admin_category_edit_after" coreWidgets={[]}/>
    </div>
}