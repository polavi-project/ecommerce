import Area from "../../../../../../../../js/production/area.js";

function TypeSelector({types, setType, type = "", id = null}) {
    if(id)
        return null;

    return <div className="form-head sticky">
        <div className="form-group">
            <label>Please select widget type</label>
            <select
                onChange={(e) => setType(e.target.value)}
                className={"form-control"}
                value={type}
            >
                <option value="" disabled>Please select widget type</option>
                {types.map((t, i) => {
                    return <option value={t.code} key={i}>{t.name}</option>
                })}
            </select>
        </div>
    </div>
}

export default function WidgetEditForm({types, selectedType = "", widgetId = null}) {
    const [type, setType] = React.useState(selectedType);

    return <Area
        id="widget_edit_page"
        coreWidgets={[
            {
                component: TypeSelector,
                props : {
                    types,
                    type,
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
                    type: type
                },
                sort_order: 20,
                id: "widget_form"
            }
        ]}
    />
}