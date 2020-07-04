import {WidgetTypeSelector} from "./select_widget_type.js";
import {WidgetGrid} from "./list.js";

export default function Widgets({types, defaultFilter, retrieveListUrl, typeRequestUrl, selectedType, showEdit = 0}) {
    return <div>
        <WidgetTypeSelector
            types={types}
            requestUrl={typeRequestUrl}
            showEdit={showEdit}
            selectedType={selectedType}
        />
        <WidgetGrid apiUrl={retrieveListUrl} defaultFilter={defaultFilter}/>
    </div>
}