import Area from "../../../../../../../../js/production/area.js";

function TypeSelector({type = "", id = null, setType}) {
    if(id)
        return null;

    return <div>
        <h3>Please select widget type</h3>
        <select
            onChange={(e) => setType(e.target.value)}
            className={"uk-input uk-select uk-input-medium"}
            value={type}
        >
            <option value="" disabled>Please select widget type</option>
            <Area
                id={"widget_types"}
                selectedType={type}
                noOuter={true}
            />
        </select>
    </div>
}

export default function WidgetEditForm({selectedType = "", widgetId = null}) {
    const [type, setType] = React.useState(selectedType);

    return <div>
        <Area
            id="widget_edit_page"
            coreWidgets={[
                {
                    component: () => <h2>{!widgetId ? "Create new widget" : "Edit widget"}</h2>,
                    props : {},
                    sort_order: 10,
                    id: "page_title"
                },
                {
                    component: TypeSelector,
                    props : {
                        type : type,
                        id : widgetId,
                        setType: setType
                    },
                    sort_order: 10,
                    id: "type_selector"
                },
                {
                    component: Area,
                    props : {
                        id: "widget_edit_form",
                        type:type
                    },
                    sort_order: 20,
                    id: "widget_form"
                }
            ]}
        />
    </div>
}