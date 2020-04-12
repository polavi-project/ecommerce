var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";

export default function ProductEditFormComponent(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(Area, { id: "admin_product_edit_before", widgets: [] }),
        React.createElement(
            Form,
            _extends({ id: "product-edit-form" }, props, { submitText: null }),
            React.createElement(
                "div",
                { className: "form-head sticky" },
                React.createElement(
                    "div",
                    { className: "child-align-middle" },
                    React.createElement(
                        A,
                        { url: props.listUrl, className: "" },
                        React.createElement("i", { className: "fas fa-arrow-left" }),
                        React.createElement(
                            "span",
                            { className: "pl-1" },
                            "Product list"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "buttons" },
                    React.createElement(
                        A,
                        { className: "btn btn-danger", url: props.cancelUrl },
                        "Cancel"
                    ),
                    React.createElement(
                        "button",
                        { type: "submit", className: "btn btn-primary" },
                        "Submit"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(Area, { id: "admin_product_edit_inner_left", coreWidgets: [], className: "col-8" }),
                React.createElement(Area, { id: "admin_product_edit_inner_right", coreWidgets: [], className: "col-4" })
            )
        ),
        React.createElement(Area, { id: "admin_product_edit_after", widgets: [] })
    );
}