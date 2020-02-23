import Area from "../../../../../../../js/production/area.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function EditForm({ displayForm, requestUrl }) {
    return React.createElement(
        "div",
        null,
        React.createElement(Area, { id: "widget-edit-form", displayForm: displayForm, requestUrl: requestUrl })
    );
}

export default function WidgetTypeSelector({ types, selectedType = '', requestUrl, showEdit = 0 }) {
    const [showEditForm, setShowEditForm] = React.useState(showEdit);
    const [type, setType] = React.useState(selectedType);
    const [showError, setShowError] = React.useState(false);

    const onSelect = e => {
        setType(e.target.value);
        let url = requestUrl + `/${e.target.value}`;
        Fetch(url, true, 'GET');
    };

    const displayForm = e => {
        e.preventDefault();
        if (!type) setShowError(true);else {
            setShowError(false);
            setShowEditForm(1);
        }
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            "Please select widget type"
        ),
        React.createElement(
            "select",
            {
                className: "uk-select uk-form-small",
                onChange: e => onSelect(e),
                value: type,
                style: { maxWidth: "200px" }
            },
            React.createElement(
                "option",
                { value: '' },
                "Select widget type"
            ),
            types.map((w, i) => {
                return React.createElement(
                    "option",
                    { key: i, value: w.code },
                    w.name
                );
            })
        ),
        showError && React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Please select widget type"
            )
        ),
        showEditForm === 1 && React.createElement(EditForm, { displayForm: displayForm, requestUrl: requestUrl }),
        showEditForm === 0 && React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", className: "uk-button-primary uk-button-small", onClick: e => displayForm(e) },
                React.createElement(
                    "span",
                    null,
                    "Add new"
                )
            )
        )
    );
}