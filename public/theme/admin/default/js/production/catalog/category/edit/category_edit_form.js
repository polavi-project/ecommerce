var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";

export default function CategoryEditForm(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(Area, { id: "admin_category_edit_before", coreWidgets: [] }),
        React.createElement(
            Form,
            _extends({ id: "category-edit-form" }, props),
            React.createElement(
                "div",
                { className: "uk-grid uk-grid-small" },
                React.createElement(Area, { id: "admin_category_edit_inner_left", coreWidgets: [], className: "uk-width-1-2" }),
                React.createElement(Area, { id: "admin_category_edit_inner_right", coreWidgets: [], className: "uk-width-1-2" })
            )
        ),
        React.createElement(Area, { id: "admin_category_edit_after", coreWidgets: [] })
    );
}