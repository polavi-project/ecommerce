import {Error} from "./error.js"
import {FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED} from "./../../event-types.js";

export default function MultiSelect (props) {
    const [value, setValue] = React.useState(props.value ? props.value : []);
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
        let val = [...e.target.options].filter(o => o.selected).map(o => o.value);
        setValue(val);
    };

    return <div className="form-group">
        <label htmlFor={name}>{props.label}</label>
        <select
            className="uk-select uk-form-small"
            id={props.id}
            name={props.name}
            value={value}
            multiple="multiple"
            onChange={onChange}
            disabled={isDisabled}
        >
            <option value="">Please select</option>
            {props.options && props.options.map((option, key)=>{
                return <option key={key} value={option.value}>{option.text}</option>;
            })}
        </select>
        <Error error={error}/>
    </div>
}