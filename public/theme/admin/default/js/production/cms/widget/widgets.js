import { WidgetTypeSelector } from "./select_widget_type.js";
import { WidgetGrid } from "./list.js";

export default function Widgets({ types, defaultFilter, retrieveListUrl, typeRequestUrl, selectedType, showEdit = 0 }) {
    return React.createElement(
        "div",
        null,
        React.createElement(WidgetTypeSelector, {
            types: types,
            requestUrl: typeRequestUrl,
            showEdit: showEdit,
            selectedType: selectedType
        }),
        React.createElement(WidgetGrid, { apiUrl: retrieveListUrl, defaultFilter: defaultFilter })
    );
}