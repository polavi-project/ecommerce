var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../../event-types.js";

export default function Select(props) {
    const [value, setValue] = React.useState(props.value !== undefined ? props.value : '');
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);

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

    const width = {
        maxWidth: props.width ? props.width : '200px'
    };

    return React.createElement(
        "div",
        { className: "form-field form-select" },
        React.createElement(
            "div",
            { className: "field-label" },
            React.createElement(
                "label",
                { htmlFor: props.name },
                props.label
            )
        ),
        React.createElement(
            "select",
            {
                className: "uk-select uk-form-small",
                id: props.name,
                name: props.name,
                value: value,
                onChange: onChange,
                disabled: isDisabled,
                style: width
            },
            React.createElement(
                "option",
                { value: "" },
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