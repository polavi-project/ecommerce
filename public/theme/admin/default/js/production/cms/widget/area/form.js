var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Text from "../../../../../../../../js/production/form/fields/text.js";
import { LayoutList } from "../../../../production/cms/widget/layout_list.js";
import { AreaList } from "../../../../production/cms/widget/area_list.js";
import { Form } from "../../../../../../../../js/production/form/form.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

function ColumnsSetting({ _columns, id, setColumns }) {

    const updateColumns = (e, i) => {
        setColumns(_columns.map((c, k) => {
            if (k === i) c.className = e.target.value;
            return c;
        }));
    };
    return React.createElement(
        "div",
        { className: "area-columns-setting mt-4" },
        React.createElement(
            "div",
            { className: "mb-4" },
            React.createElement(
                "h4",
                null,
                "Columns setting"
            )
        ),
        React.createElement(
            "div",
            { className: "row" },
            _columns.map((c, i) => {
                return React.createElement(
                    "div",
                    { className: "item col-" + c.number },
                    React.createElement(
                        "div",
                        { className: "item-inner" },
                        React.createElement(
                            "div",
                            { className: "id" },
                            React.createElement(
                                "strong",
                                null,
                                "ID"
                            ),
                            " : ",
                            id + "_" + i,
                            " "
                        ),
                        React.createElement(
                            "div",
                            { className: "mt-3" },
                            React.createElement(Text, {
                                name: `columns[${i}]['className']`,
                                label: "Css class",
                                value: c.className,
                                handler: e => updateColumns(e, i)
                            })
                        )
                    )
                );
            })
        )
    );
}

function Templates({ template = 12, selectTemplate }) {
    return React.createElement(
        "div",
        { className: "area-widget-templates" },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-4" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 12 ? "selected" : ""), onClick: () => selectTemplate(12) },
                        React.createElement("div", { className: "col-12 unit unit1" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 48 ? "selected" : ""), onClick: () => selectTemplate(48) },
                        React.createElement("div", { className: "col-4 unit unit1" }),
                        React.createElement("div", { className: "col-8 unit unit2" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 444 ? "selected" : ""), onClick: () => selectTemplate(444) },
                        React.createElement("div", { className: "col-4 unit unit1" }),
                        React.createElement("div", { className: "col-4 unit unit2" }),
                        React.createElement("div", { className: "col-4 unit unit3" })
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "col-4" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 66 ? "selected" : ""), onClick: () => selectTemplate(66) },
                        React.createElement("div", { className: "col-6 unit unit1" }),
                        React.createElement("div", { className: "col-6 unit unit2" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 84 ? "selected" : ""), onClick: () => selectTemplate(84) },
                        React.createElement("div", { className: "col-8 unit unit1" }),
                        React.createElement("div", { className: "col-4 unit unit2" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 3333 ? "selected" : ""), onClick: () => selectTemplate(3333) },
                        React.createElement("div", { className: "col-3 unit unit1" }),
                        React.createElement("div", { className: "col-3 unit unit2" }),
                        React.createElement("div", { className: "col-3 unit unit3" }),
                        React.createElement("div", { className: "col-3 unit unit4" })
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "col-4" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 633 ? "selected" : ""), onClick: () => selectTemplate(633) },
                        React.createElement("div", { className: "col-6 unit unit1" }),
                        React.createElement("div", { className: "col-3 unit unit2" }),
                        React.createElement("div", { className: "col-3 unit unit3" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 336 ? "selected" : ""), onClick: () => selectTemplate(336) },
                        React.createElement("div", { className: "col-3 unit unit1" }),
                        React.createElement("div", { className: "col-3 unit unit2" }),
                        React.createElement("div", { className: "col-6 unit unit3" })
                    ),
                    React.createElement(
                        "div",
                        { className: "item row " + (template == 363 ? "selected" : ""), onClick: () => selectTemplate(363) },
                        React.createElement("div", { className: "col-3 unit unit1" }),
                        React.createElement("div", { className: "col-6 unit unit2" }),
                        React.createElement("div", { className: "col-3 unit unit3" })
                    )
                )
            )
        )
    );
}

export default function AreaWidget({ id, name, status, setting, displaySetting, sort_order, formAction, redirect, areaProps }) {
    const [template, setTemplate] = React.useState(_.find(setting, { key: 'template' }) !== undefined ? _.get(_.find(setting, { key: 'template' }), 'value', '') : 12);

    // [{number: 3, className: "col-3 newsletter"},{number: 9, className: "col-9 newsletter"}]
    const [columns, setColumns] = React.useState(_.find(setting, { key: 'columns' }) !== undefined ? JSON.parse(_.get(_.find(setting, { key: 'columns' }), 'value', '[]')) : []);

    const [areaId, setAreaId] = React.useState(_.find(setting, { key: 'id' }) !== undefined ? _.get(_.find(setting, { key: 'id' }), 'value', '') : "");

    React.useEffect(() => {
        let fromSetting = _.find(setting, { key: 'columns' }) !== undefined ? _.get(_.find(setting, { key: 'columns' }), 'value', '') : "";

        if (fromSetting !== "") setColumns(JSON.parse(fromSetting));
    }, []);

    React.useEffect(() => {
        let cols = [];

        if (template === 12 || !template) cols = [12];else {
            let sNumber = template.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                cols.push(+sNumber.charAt(i));
            }
        }

        let tmpCols = [];
        cols.forEach((c, i) => {
            if (columns[i] !== undefined) {
                tmpCols[i] = _extends({}, columns[i], { number: c });
            } else {
                tmpCols[i] = { number: c, className: "col-" + c };
            }
        });

        setColumns(tmpCols);
    }, [template]);

    const layout = _.find(displaySetting, { key: 'layout' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'layout' }), 'value', [])) : [];
    const area = _.find(displaySetting, { key: 'area' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'area' }), 'value', [])) : [];
    const manualInputAreas = _.find(displaySetting, { key: 'area_manual_input' }) !== undefined ? _.get(_.find(displaySetting, { key: 'area_manual_input' }), 'value', "") : "";

    const dispatch = ReactRedux.useDispatch();

    const onComplete = response => {
        if (_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_success", message: 'Widget has been saved successfully', type: "success" }] } });
            Fetch(redirect, true);
        } else dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error" }] } });
    };

    const selectTemplate = template => {
        setTemplate(template);

        let cols = [];

        if (template === 12 || !template) cols = [12];else {
            let sNumber = template.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                cols.push(+sNumber.charAt(i));
            }
        }

        let tmpCols = [];
        cols.forEach((c, i) => {
            if (columns[i] !== undefined) {
                tmpCols[i] = _extends({}, columns[i], { number: c });
            } else {
                tmpCols[i] = { number: c };
            }
        });

        setColumns(tmpCols);
    };

    if (areaProps.type !== 'area') return null;

    return React.createElement(
        "div",
        { className: "mt-4" },
        React.createElement(
            Form,
            {
                id: "area-widget-edit-form",
                action: formAction,
                onComplete: onComplete,
                submitText: null
            },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-8" },
                    React.createElement(
                        "div",
                        { className: "sml-block" },
                        React.createElement(
                            "div",
                            { className: "sml-block-title" },
                            "Area widget"
                        ),
                        React.createElement("input", { type: "text", name: "query", value: "mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}", readOnly: true, style: { display: 'none' } }),
                        React.createElement("input", { type: "text", name: "variables[widget][type]", value: "area", readOnly: true, style: { display: 'none' } }),
                        id && React.createElement("input", { type: "text", name: "variables[widget][id]", value: id, readOnly: true, style: { display: 'none' } }),
                        React.createElement(Text, {
                            name: "variables[widget][name]",
                            value: name,
                            formId: "area-widget-edit-form",
                            validation_rules: ['notEmpty'],
                            label: "Name"
                        }),
                        React.createElement(Switch, {
                            name: "variables[widget][status]",
                            value: status,
                            formId: "area-widget-edit-form",
                            label: "Status"
                        }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][0][key]", value: "id", readOnly: true, style: { display: 'none' } }),
                        React.createElement(Text, {
                            formId: "area-widget-edit-form",
                            validation_rules: ["notEmpty"],
                            name: "variables[widget][setting][0][value]",
                            value: areaId,
                            handler: e => setAreaId(e.target.value),
                            label: "Area ID"
                        }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][1][key]", value: "container_class", readOnly: true, style: { display: 'none' } }),
                        React.createElement(Text, {
                            name: "variables[widget][setting][1][value]",
                            value: _.find(setting, { key: 'container_class' }) !== undefined ? _.get(_.find(setting, { key: 'container_class' }), 'value', 'row') : 'row',
                            formId: "area-widget-edit-form",
                            label: "Container class"
                        }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][2][key]", value: "template", readOnly: true, style: { display: 'none' } }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][2][value]", readOnly: true, style: { display: 'none' }, value: template }),
                        React.createElement(Templates, { template: template, selectTemplate: selectTemplate }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][3][key]", value: "columns", readOnly: true, style: { display: 'none' } }),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][3][value]", readOnly: true, style: { display: 'none' }, value: JSON.stringify(columns) }),
                        React.createElement(ColumnsSetting, { template: template, _columns: columns, setColumns: setColumns, id: areaId }),
                        React.createElement(
                            "div",
                            { className: "mt-4 text-right" },
                            React.createElement(
                                "button",
                                { type: "submit", className: "btn btn-primary" },
                                "Submit"
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-4" },
                    React.createElement(
                        "div",
                        { className: "sml-block" },
                        React.createElement(
                            "div",
                            { className: "sml-block-title" },
                            "Select page layout"
                        ),
                        React.createElement(LayoutList, { formId: "area-widget-edit-form", selectedLayouts: layout })
                    ),
                    React.createElement(
                        "div",
                        { className: "sml-block mt-4" },
                        React.createElement(
                            "div",
                            { className: "sml-block-title" },
                            "Select area"
                        ),
                        React.createElement(AreaList, { formId: "area-widget-edit-form", selectedAreas: area, manualInputAreas: manualInputAreas }),
                        React.createElement(Text, {
                            name: "variables[widget][sort_order]",
                            value: sort_order,
                            formId: "area-widget-edit-form",
                            label: "Sort order"
                        })
                    )
                )
            )
        )
    );
}