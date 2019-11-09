var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";

export default function DatabaseForm(props) {
    const [isSuccess, setIsSuccess] = React.useState(true);
    if (props.step !== 'database') return null;
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Database information"
            )
        ),
        React.createElement(
            "p",
            null,
            "Please provide your database connection information."
        ),
        isSuccess === false && React.createElement(
            "p",
            { className: "text-danger" },
            "Can not connect to database. Please check again your information."
        ),
        React.createElement(
            Form,
            _extends({
                id: "database-form",
                submitText: "Next",
                onComplete: response => {
                    if (response.success === 1) props.setStep('adminUser');else setIsSuccess(false);
                }
            }, props),
            React.createElement(
                "div",
                { className: "uk-grid uk-grid-small" },
                React.createElement(Area, {
                    id: "database_form_inner",
                    coreWidgets: [{
                        component: Text,
                        props: {
                            id: "db_name",
                            formId: "database-form",
                            name: "db_name",
                            label: "Database name",
                            value: '',
                            validation_rules: ['notEmpty']
                        },
                        sort_order: 10,
                        id: "db_name"
                    }, {
                        component: Text,
                        props: {
                            id: "db_user",
                            formId: "database-form",
                            name: "db_user",
                            label: "Database user",
                            value: '',
                            validation_rules: ['notEmpty']
                        },
                        sort_order: 20,
                        id: "db_user"
                    }, {
                        component: Text,
                        props: {
                            id: "db_password",
                            formId: "database-form",
                            name: "db_password",
                            label: "Database password",
                            value: '',
                            validation_rules: ['notEmpty']
                        },
                        sort_order: 30,
                        id: "db_password"
                    }, {
                        component: Text,
                        props: {
                            id: "db_host",
                            formId: "database-form",
                            name: "db_host",
                            label: "Database host",
                            value: 'localhost',
                            validation_rules: ['notEmpty']
                        },
                        sort_order: 30,
                        id: "db_host"
                    }]
                })
            )
        )
    );
}