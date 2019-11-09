import Area from "../../../../../../../js/production/area.js";
import DatabaseForm from "./database.js";
import FirstUserForm from "./admin_user_info.js";

export default function Dat(props) {
    const [step, setStep] = React.useState('database');

    return React.createElement(
        "div",
        { className: "uk-align-center" },
        React.createElement(
            "div",
            { className: "uk-text-center" },
            React.createElement(
                "h3",
                null,
                "Welcome to Similik."
            )
        ),
        React.createElement(Area, {
            id: "installation_form_inner",
            coreWidgets: [{
                component: DatabaseForm,
                props: { step, setStep },
                sort_order: 10,
                id: "database_form"
            }, {
                component: FirstUserForm,
                props: { step, setStep },
                sort_order: 20,
                id: "admin_user_form"
            }]
        })
    );
}