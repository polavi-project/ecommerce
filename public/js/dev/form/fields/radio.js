import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED, FORM_FIELD_UPDATED} from "./../../event-types.js";

export default function Radio (props) {
    const [value, setValue] = React.useState(props.value ? props.value : '');
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        PubSub.publishSync(FORM_FIELD_UPDATED, {name: props.name, value});
    });

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
        setValue(e.target.value);
    };

    const options = props.options ? props.options : [];

    return <div className="form-element form-element-text">
        {
            options.map((o,i) => {
                return <label style={{display: 'block'}} key={i} htmlFor={name}><input
                    type="radio"
                    className="uk-radio"
                    name={props.name}
                    value={o.value}
                    checked={value === o.value}
                    onChange={onChange}
                    disabled={isDisabled}
                /> {o.text}</label>
            })
        }
        { props.comment &&
            <div><i>{props.comment}</i></div>
        }
        <Error error={error}/>
    </div>
}