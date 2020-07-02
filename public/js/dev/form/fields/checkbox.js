import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED} from "./../../event-types.js";

export default function Checkbox (props) {
    const [isChecked, setChecked] = React.useState(props.isChecked);
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(props.disabled);

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
        if (props.handler) props.handler.call(window, e, props);
    };

    return <div className="form-group polavi-checkbox">
        <div>
            <label htmlFor={props.name}><input
                type="checkbox"
                className="uk-checkbox"
                id={props.name}
                name={props.name}
                value={props.value}
                onChange={onChange}
                disabled={isDisabled}
                checked={isChecked}
            />
                {!isChecked && <i className="fas fa-square font-color-primary"></i>}
                {isChecked && <i className="fas fa-check-square font-color-primary"></i>}
                {props.label}
            </label>
        </div>
        { props.comment &&
            <p><i>{props.comment}</i></p>
        }
        <Error error={error}/>
    </div>
}