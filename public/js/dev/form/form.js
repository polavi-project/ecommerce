import {FORM_SUBMIT, FORM_VALIDATED, FORM_FIELD_CREATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED} from "./../event-types.js"
import {validator} from "./validator.js"
import {Fetch} from "../fetch.js"

function Form(props) {
    const validationRules = React.useRef({});
    const [token1, setToken1] = React.useState(()=> {
        let token = PubSub.subscribe(FORM_FIELD_CREATED, function(message, data) {
            if(data.name === undefined || data.validation_rules === undefined || data.formId !== props.id)
                return;
            let rules = validationRules.current;
            rules[data.name] = data.validation_rules;
            validationRules.current = rules;
        });

        return token;
    });
    const [token2, setToken2] = React.useState(()=> {
        let token = PubSub.subscribe(FORM_FIELD_REMOVED, function(message, data) {
            if(data.name === undefined || data.validation_rules === undefined || data.formId !== props.id)
                return;
            delete  validationRules.current[data.name];
        });

        return token;
    });

    React.useEffect(()=> {
        if(props.defaultLanguage !== props.currentLanguage && props.currentLanguage !== undefined)
            PubSub.publishSync(FORM_LANGUAGE_CHANGED, {formId: props.id, defaultLanguage: props.defaultLanguage, currentLanguage: props.currentLanguage});
        return function cleanup() {
            PubSub.unsubscribe(token1);
            PubSub.unsubscribe(token2);
        };
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        PubSub.publishSync(FORM_SUBMIT, {props});
        let errors = validate();
        PubSub.publishSync(FORM_VALIDATED, {formId: props.id, errors});
        if (Object.keys(errors).length === 0) {
            let formData = new FormData(document.getElementById(props.id));
            Fetch(props.action, false, "POST", formData, props.onStart, props.onComplete, props.onError);
        }
    };

    const validate = () => {
        let errors = {};
        let formData = new FormData(document.getElementById(props.id));
        Object.keys(validationRules.current).forEach(function (fieldName) {
            validationRules.current[fieldName].forEach(function(r) {
                if(validator.getRule(r) === undefined)
                    return;
                const val = formData.get(fieldName);
                if(!validator.getRule(r).handler.call(this, val)) {
                    errors = {...errors, [fieldName]: validator.getRule(r).errorMessage};
                } else {
                    delete errors[fieldName];
                }
            })
        });

        return errors;
    };

    return <form id={props.id} method="POST" onSubmit = {(e)=>onSubmit(e)} className={props.className}>
        {props.children}
        {props.submitText !== null &&
        <div className="similik-form-button form-submit-button">
            <button type="submit" className="btn btn-primary">
                {props.submitText ? props.submitText : 'Submit'}
            </button>
        </div>
        }
    </form>;
}

export {Form}