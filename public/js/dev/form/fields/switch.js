import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED} from "./../../event-types.js";

export default function Switch (props) {
    const [value, setValue] = React.useState(props.value !== undefined ? parseInt(props.value) : 0);
    const [error, setError] = React.useState(undefined);

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
        if(props.isDisabled === true)
            return;
        setValue(value === 1 ? 0 : 1);
        if (props.handler) props.handler.call(window, e, props);
    };

    return <div className="form-group similik-switch">
        <label>{props.label}</label>
        <input type="hidden" value={value} name={props.name}/>
        <div>
            {value == 0 && <i className="fas fa-toggle-off" onClick={(e)=>onChange(e)}></i>}
            {value == 1 && <i className="fas fa-toggle-on" onClick={(e)=>onChange(e)}></i>}
        </div>
        { props.comment &&
            <div><i>{props.comment}</i></div>
        }
        <Error error={error}/>
    </div>
}