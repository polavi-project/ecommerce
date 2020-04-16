import Area from "../../../../../../../../js/production/area.js";

function TypeSelector({ types, setType, type = "", id = null }) {
    if (id) return null;

    return React.createElement(
        "div",
        { className: "form-head sticky" },
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                null,
                "Please select widget type"
            ),
            React.createElement(
                "select",
                {
                    onChange: e => setType(e.target.value),
                    className: "form-control",
                    value: type
                },
                React.createElement(
                    "option",
                    { value: "", disabled: true },
                    "Please select widget type"
                ),
                types.map((t, i) => {
                    return React.createElement(
                        "option",
                        { value: t.code, key: i },
                        t.name
                    );
                })
            )
        )
    );
}

export default function WidgetEditForm({ types, selectedType = "", widgetId = null }) {
    const [type, setType] = React.useState(selectedType);

    return React.createElement(Area, {
        id: "widget_edit_page",
        coreWidgets: [{
            component: TypeSelector,
            props: {
                types,
                type,
                id: widgetId,
                setType: setType
            },
            sort_order: 10,
            id: "type_selector"
        }, {
            component: Area,
            props: {
                id: "widget_edit_form",
                type: type
            },
            sort_order: 20,
            id: "widget_form"
        }]
    });
}