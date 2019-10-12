import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"

export default function GeneralSettingForms(props) {
    return <div>
        <Form {...props}>
            <div>
                <h1>General setting</h1>
                <p>This is where you configure store basic information</p>
            </div>
            <Area id="general_setting_form_inner" widgets={[]}/>
        </Form>
    </div>
}