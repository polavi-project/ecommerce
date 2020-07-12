var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { FORM_SUBMIT, FORM_VALIDATED, FORM_FIELD_CREATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../event-types.js";
import { validator } from "./validator.js";
import { Fetch } from "../fetch.js";

function Form(props) {
    const validationRules = React.useRef({});
    const formRef = React.useRef();
    const [token1, setToken1] = React.useState(() => {
        let token = PubSub.subscribe(FORM_FIELD_CREATED, function (message, data) {
            if (data.name === undefined || data.validation_rules === undefined || data.disabled === true || data.formId !== props.id) return;
            let rules = validationRules.current;
            rules[data.name] = data.validation_rules;
            validationRules.current = rules;
        });

        return token;
    });
    const [token2, setToken2] = React.useState(() => {
        let token = PubSub.subscribe(FORM_FIELD_REMOVED, function (message, data) {
            if (data.name === undefined || data.validation_rules === undefined || data.disabled === true || data.formId !== props.id) return;
            delete validationRules.current[data.name];
        });

        return token;
    });

    React.useEffect(() => {
        if (props.defaultLanguage !== props.currentLanguage && props.currentLanguage !== undefined) PubSub.publishSync(FORM_LANGUAGE_CHANGED, { formId: props.id, defaultLanguage: props.defaultLanguage, currentLanguage: props.currentLanguage });
        return function cleanup() {
            PubSub.unsubscribe(token1);
            PubSub.unsubscribe(token2);
        };
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        PubSub.publishSync(FORM_SUBMIT, { props });
        let errors = validate();
        PubSub.publishSync(FORM_VALIDATED, { formId: props.id, errors });
        if (Object.keys(errors).length === 0) {
            let formData = new FormData(document.getElementById(props.id));
            Fetch(props.action, false, "POST", formData, props.onStart, props.onComplete, props.onError);
        }
    };

    const validate = () => {
        let errors = {};
        let formData = new FormData(document.getElementById(props.id));
        Object.keys(validationRules.current).forEach(function (fieldName) {
            validationRules.current[fieldName].forEach(function (r) {
                if (validator.getRule(r) === undefined) return;
                const val = formData.get(fieldName);
                if (!validator.getRule(r).handler.call(this, val)) {
                    errors = _extends({}, errors, { [fieldName]: validator.getRule(r).errorMessage });
                } else {
                    delete errors[fieldName];
                }
            });
        });

        return errors;
    };

    return React.createElement(
        "form",
        { ref: formRef, id: props.id, method: "POST", onSubmit: e => onSubmit(e), className: props.className },
        props.children,
        props.submitText !== null && React.createElement(
            "div",
            { className: "polavi-form-button form-submit-button" },
            React.createElement(
                "a",
                { href: "javascript:void(0)", className: "btn btn-primary", onClick: () => {
                        formRef.current.dispatchEvent(new Event('submit'));
                    } },
                props.submitText ? props.submitText : 'Submit'
            )
        )
    );
}

export { Form };