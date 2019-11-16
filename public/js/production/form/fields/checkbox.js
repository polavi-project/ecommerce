var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../../event-types.js";

export default function Checkbox(props) {
    const [isChecked, setChecked] = React.useState(props.isChecked);
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
        if (isDisabled === true) return false;
        setChecked(e.target.checked);
    };

    return React.createElement(
        "div",
        { className: "form-field form-checkbox" },
        React.createElement(
            "label",
            { htmlFor: name },
            React.createElement("input", {
                type: "checkbox",
                className: "uk-checkbox",
                id: props.name,
                name: props.name,
                onChange: onChange,
                disabled: isDisabled,
                checked: isChecked
            }),
            " ",
            props.label
        ),
        props.comment && React.createElement(
            "p",
            null,
            React.createElement(
                "i",
                null,
                props.comment
            )
        ),
        React.createElement(Error, { error: error })
    );
}