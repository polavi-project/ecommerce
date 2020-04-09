var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED } from "./../../event-types.js";

export default function Switch(props) {
    const [value, setValue] = React.useState(props.value !== undefined ? parseInt(props.value) : 0);
    const [error, setError] = React.useState(undefined);

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
        if (props.isDisabled === true) return;
        setValue(value === 1 ? 0 : 1);
        if (props.handler) props.handler.call(window, e, props);
    };

    return React.createElement(
        "div",
        { className: "form-group similik-switch" },
        React.createElement(
            "label",
            null,
            props.label
        ),
        React.createElement("input", { type: "hidden", value: value, name: props.name }),
        React.createElement(
            "div",
            null,
            value == 0 && React.createElement("i", { className: "fas fa-toggle-off", onClick: e => onChange(e) }),
            value == 1 && React.createElement("i", { className: "fas fa-toggle-on", onClick: e => onChange(e) })
        ),
        props.comment && React.createElement(
            "div",
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