import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";

export default function GeneralSettingForms(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            Form,
            props,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    null,
                    "General setting"
                ),
                React.createElement(
                    "p",
                    null,
                    "This is where you configure store basic information"
                )
            ),
            React.createElement(Area, { id: "general_setting_form_inner", widgets: [] })
        )
    );
}