var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../../event-types.js";

export default function Select(props) {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        setValue(props.value ? props.value : "");
    }, [props.value]);

    React.useEffect(() => {
        setIsDisabled(props.disabled ? props.disabled : false);
    }, [props.disabled]);

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
        React.createElement(
            "select",
            {
                className: "form-control",
                id: props.name,
                name: props.name,
                value: value,
                onChange: onChange,
                disabled: isDisabled
            },
            React.createElement(
                "option",
                { value: "", disabled: true },
                "Please select"
            ),
            props.options && props.options.map((option, key) => {
                return React.createElement(
                    "option",
                    { key: key, value: option.value },
                    option.text
                );
            })
        ),
        React.createElement(Error, { error: error })
    );
}