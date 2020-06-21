var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../../event-types.js";

export default function Text(props) {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);

    React.useEffect(() => {
        setValue(props.value ? props.value : "");
    }, [props.value]);

    React.useEffect(() => {
        setIsDisabled(props.disabled ? props.value : false);
    }, [props.disabled]);

    React.useEffect(() => {
        setReadOnly(props.readOnly ? props.readOnly : false);
    }, [props.readOnly]);

    React.useEffect(() => {
        PubSub.publishSync(FORM_FIELD_CREATED, _extends({}, props));
        let tokenOne = PubSub.subscribe(FORM_VALIDATED, function (message, data) {
            if (data.formId === props.formId) {
                setError(data.errors[props.name]);
            }
        });

        let tokenTwo = PubSub.subscribe(FORM_LANGUAGE_CHANGED, function (message, data) {
            if (data.formId === props.formId) {
                if (props.isTranslateAble === false) {
                    setIsDisabled(true);
                }
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(tokenOne);
            PubSub.unsubscribe(tokenTwo);
            PubSub.publishSync(FORM_FIELD_REMOVED, _extends({}, props));
        };
    }, []);

    const onChange = e => {
        if (isDisabled === true) return false;
        setValue(e.target.value);
        if (props.handler) props.handler.call(window, e, props);
    };

    return React.createElement(
        "div",
        { className: "form-group" },
        props.label && React.createElement(
            "label",
            { htmlFor: props.name },
            props.label
        ),
        React.createElement("input", {
            type: "text",
            className: "form-control",
            id: props.name,
            name: props.name,
            placeholder: props.placeholder,
            value: value,
            onChange: onChange,
            disabled: isDisabled,
            readOnly: readOnly
        }),
        props.comment && React.createElement(
            "small",
            { className: "form-text text-muted" },
            React.createElement(
                "i",
                null,
                props.comment
            )
        ),
        React.createElement(Error, { error: error })
    );
}