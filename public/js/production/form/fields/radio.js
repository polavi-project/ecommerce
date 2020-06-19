var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED, FORM_FIELD_UPDATED } from "./../../event-types.js";

export default function Radio(props) {
    const [value, setValue] = React.useState(props.value !== undefined ? props.value : '');
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(props.disabled);

    React.useEffect(() => {
        PubSub.publishSync(FORM_FIELD_UPDATED, { name: props.name, value });
    });

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
        { className: "form-group similik-radio" },
        props.label && React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                null,
                props.label
            )
        ),
        props.options.map((o, i) => {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { key: i, htmlFor: props.name + i },
                    React.createElement("input", {
                        type: "radio",
                        className: "uk-radio",
                        name: props.name,
                        id: props.name + i,
                        value: o.value,
                        checked: value == o.value,
                        onChange: onChange,
                        disabled: isDisabled
                    }),
                    value != o.value && React.createElement("i", { className: "fas fa-circle font-color-primary" }),
                    value == o.value && React.createElement("i", { className: "fas fa-check-circle font-color-primary" }),
                    o.text
                )
            );
        }),
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