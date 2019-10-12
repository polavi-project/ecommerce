var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";

export default function ProductEditFormComponent(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(Area, { id: "admin_product_edit_before", widgets: [] }),
        React.createElement(
            Form,
            _extends({ id: "product-edit-form" }, props),
            React.createElement(Area, { id: "admin_product_edit_inner", widgets: [] })
        ),
        React.createElement(Area, { id: "admin_product_edit_after", widgets: [] })
    );
}