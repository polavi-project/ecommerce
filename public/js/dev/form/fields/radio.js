import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED, FORM_FIELD_UPDATED} from "./../../event-types.js";

export default function Radio (props) {
    const [value, setValue] = React.useState(props.value !== undefined ? props.value : '');
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
        setValue(e.target.value);
        if (props.handler) props.handler.call(window, e, props);
    };

    return <div className="form-group similik-radio">
        <div><label>{props.label}</label></div>
        {
            props.options.map((o,i) => {
                return <div>
                    <label key={i} htmlFor={props.name + i}><input
                        type="radio"
                        className="uk-radio"
                        name={props.name}
                        id={props.name + i}
                        value={o.value}
                        checked={value == o.value}
                        onChange={onChange}
                        disabled={isDisabled}
                    />
                        {value != o.value && <i className="fas fa-circle font-color-primary"></i>}
                        {value == o.value && <i className="fas fa-check-circle font-color-primary"></i>}
                        {o.text}
                    </label>
                </div>
            })
        }
        { props.comment &&
            <div><i>{props.comment}</i></div>
        }
        <Error error={error}/>
    </div>
}