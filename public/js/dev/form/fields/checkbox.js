import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED} from "./../../event-types.js";

export default function Checkbox (props) {
    const [isChecked, setChecked] = React.useState(props.isChecked);
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        PubSub.publishSync(FORM_FIELD_CREATED, {...props});
        let tokenOne = PubSub.subscribe(FORM_VALIDATED, function(message, data) {
            if(data.formId === props.formId) {
                setError(data.errors[props.name]);
            }
        });

        let tokenTwo = PubSub.subscribe(FORM_LANGUAGE_CHANGED, function(message, data) {
            if(data.formId === props.formId) {
                if(props.isTranslateAble === false) {
                    setIsDisabled(true);
                }
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(tokenOne);
            PubSub.unsubscribe(tokenTwo);
            PubSub.publishSync(FORM_FIELD_REMOVED, {...props});
        };
    }, []);

    const onChange = (e)=> {
        if(isDisabled === true)
            return false;
        setChecked(e.target.checked);
    };

    return <div className="form-field form-checkbox">
        <label htmlFor={name}><input
            type="checkbox"
            className="uk-checkbox"
            id={props.name}
            name={props.name}
            onChange={onChange}
            disabled={isDisabled}
            checked={isChecked}
        /> {props.label}</label>
        { props.comment &&
            <p><i>{props.comment}</i></p>
        }
        <Error error={error}/>
    </div>
}