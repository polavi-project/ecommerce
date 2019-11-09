import Area from "../../../../../../../js/production/area.js"
import DatabaseForm from "./database.js";
import FirstUserForm from "./admin_user_info.js";

export default function Dat(props) {
    const [step, setStep] = React.useState('database');

    return <div className="uk-align-center">
        <div className="uk-text-center"><h3>Welcome to Similik.</h3></div>
        <Area
            id="installation_form_inner"
            coreWidgets={[
                {
                    component: DatabaseForm,
                    props : {step, setStep},
                    sort_order: 10,
                    id: "database_form"
                },
                {
                    component: FirstUserForm,
                    props : {step, setStep},
                    sort_order: 20,
                    id: "admin_user_form"
                }
            ]}
        />
    </div>
}