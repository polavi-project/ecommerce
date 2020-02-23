import Area from "../../../../../../../../js/production/area.js";

function TypeSelector({ type = "", id = null, setType }) {
    if (id) return null;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            "Please select widget type"
        ),
        React.createElement(
            "select",
            {
                onChange: e => setType(e.target.value),
                className: "uk-input uk-select uk-input-medium",
                value: type
            },
            React.createElement(
                "option",
                { value: "", disabled: true },
                "Please select widget type"
            ),
            React.createElement(Area, {
                id: "widget_types",
                selectedType: type,
                noOuter: true
            })
        )
    );
}

export default function WidgetEditForm({ selectedType = "", widgetId = null }) {
    const [type, setType] = React.useState(selectedType);

    return React.createElement(
        "div",
        null,
        React.createElement(Area, {
            id: "widget_edit_page",
            coreWidgets: [{
                component: () => React.createElement(
                    "h2",
                    null,
                    !widgetId ? "Create new widget" : "Edit widget"
                ),
                props: {},
                sort_order: 10,
                id: "page_title"
            }, {
                component: TypeSelector,
                props: {
                    type: type,
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
        })
    );
}