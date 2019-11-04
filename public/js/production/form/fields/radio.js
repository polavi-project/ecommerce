var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Error } from "./error.js";
import { FORM_FIELD_CREATED, FORM_VALIDATED, FORM_FIELD_REMOVED, FORM_LANGUAGE_CHANGED, FORM_FIELD_UPDATED } from "./../../event-types.js";

export default function Radio(props) {
    const [value, setValue] = React.useState(props.value ? props.value : '');
    const [error, setError] = React.useState(undefined);
    const [isDisabled, setIsDisabled] = React.useState(false);

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
        if (isDisabled === true) return false;
        setValue(e.target.value);
    };

    const options = props.options ? props.options : [];

    return React.createElement(
        "div",
        { className: "form-field form-radio" },
        options.map((o, i) => {
            return React.createElement(
                "label",
                { style: { display: 'block' }, key: i, htmlFor: name },
                React.createElement("input", {
                    type: "radio",
                    className: "uk-radio",
                    name: props.name,
                    value: o.value,
                    checked: value === o.value,
                    onChange: onChange,
                    disabled: isDisabled
                }),
                " ",
                o.text
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