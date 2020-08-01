import Text from "../../../../../../../../js/production/form/fields/text.js";
import {LayoutList} from "../../../../production/cms/widget/layout_list.js";
import {AreaList} from "../../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

function ColumnsSetting({_columns, id, setColumns}) {

    const updateColumns = (e, i) => {
        setColumns(_columns.map((c, k)=>{
            if(k === i)
                c.className = e.target.value;
            return c;
        }))
    };
    return <div className="area-columns-setting mt-4">
        <div className="mb-4"><h4>Columns setting</h4></div>
        <div className="row">
            {_columns.map((c, i) => {
                return <div className={"item col-" + c.number}>
                    <div className="item-inner">
                        <div className="id"><strong>ID</strong> : {id + "_" + i} </div>
                        <div className="mt-3">
                            <Text
                                name={`columns[${i}]['className']`}
                                label={"Css class"}
                                value={c.className}
                                handler={(e) => updateColumns(e, i)}
                            />
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

function Templates({template = 12, selectTemplate}) {
    return <div className="area-widget-templates">
        <div className="row">
            <div className="col-4">
                <div className="container">
                    <div className={"item row " + (template == 12 ? "selected" : "")} onClick={() => selectTemplate(12)}>
                        <div className="col-12 unit unit1"></div>
                    </div>

                    <div className={"item row " + (template == 48 ? "selected" : "")} onClick={() => selectTemplate(48)}>
                        <div className="col-4 unit unit1"></div>
                        <div className="col-8 unit unit2"></div>
                    </div>

                    <div className={"item row " + (template == 444 ? "selected" : "")} onClick={() => selectTemplate(444)}>
                        <div className="col-4 unit unit1"></div>
                        <div className="col-4 unit unit2"></div>
                        <div className="col-4 unit unit3"></div>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className="container">
                    <div className={"item row " + (template == 66 ? "selected" : "")} onClick={() => selectTemplate(66)}>
                        <div className="col-6 unit unit1"></div>
                        <div className="col-6 unit unit2"></div>
                    </div>

                    <div className={"item row " + (template == 84 ? "selected" : "")} onClick={() => selectTemplate(84)}>
                        <div className="col-8 unit unit1"></div>
                        <div className="col-4 unit unit2"></div>
                    </div>

                    <div className={"item row " + (template == 3333 ? "selected" : "")} onClick={() => selectTemplate(3333)}>
                        <div className="col-3 unit unit1"></div>
                        <div className="col-3 unit unit2"></div>
                        <div className="col-3 unit unit3"></div>
                        <div className="col-3 unit unit4"></div>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className="container">
                    <div className={"item row " + (template == 633 ? "selected" : "")} onClick={() => selectTemplate(633)}>
                        <div className="col-6 unit unit1"></div>
                        <div className="col-3 unit unit2"></div>
                        <div className="col-3 unit unit3"></div>
                    </div>

                    <div className={"item row " + (template == 336 ? "selected" : "")} onClick={() => selectTemplate(336)}>
                        <div className="col-3 unit unit1"></div>
                        <div className="col-3 unit unit2"></div>
                        <div className="col-6 unit unit3"></div>
                    </div>

                    <div className={"item row " + (template == 363 ? "selected" : "")} onClick={() => selectTemplate(363)}>
                        <div className="col-3 unit unit1"></div>
                        <div className="col-6 unit unit2"></div>
                        <div className="col-3 unit unit3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default function AreaWidget({id, name, status, setting, displaySetting, sort_order, formAction, redirect, areaProps}) {
    const [template, setTemplate] = React.useState(_.find(setting, {key:'template'}) !== undefined ? _.get(_.find(setting, {key:'template'}), 'value', '') : 12);

    // [{number: 3, className: "col-3 newsletter"},{number: 9, className: "col-9 newsletter"}]
    const [columns, setColumns] = React.useState(_.find(setting, {key:'columns'}) !== undefined ? JSON.parse(_.get(_.find(setting, {key:'columns'}), 'value', '[]')) : []);

    const [areaId, setAreaId] = React.useState(_.find(setting, {key:'id'}) !== undefined ? _.get(_.find(setting, {key:'id'}), 'value', '') : "");

    React.useEffect(()=>{
        let fromSetting = _.find(setting, {key:'columns'}) !== undefined ? _.get(_.find(setting, {key:'columns'}), 'value', '') : "";

        if(fromSetting !== "")
            setColumns(JSON.parse(fromSetting));
    }, []);

    React.useEffect(() => {
        let cols = [];

        if(template === 12 || !template)
            cols = [12];
        else {
            let sNumber = template.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                cols.push(+sNumber.charAt(i));
            }
        }

        let tmpCols = [];
        cols.forEach((c, i) => {
             if(columns[i] !== undefined) {
                 tmpCols[i] = {...columns[i], number: c};
             } else {
                 tmpCols[i] = {number: c, className: "col-" + c}
             }
        });

        setColumns(tmpCols);
    }, [template]);

    const layout = _.find(displaySetting, {key:'layout'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'layout'}), 'value', [])) : [];
    const area = _.find(displaySetting, {key:'area'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'area'}), 'value', [])) : [];
    const manualInputAreas = _.find(displaySetting, {key:'area_manual_input'}) !== undefined ? _.get(_.find(displaySetting, {key:'area_manual_input'}), 'value', "") : "";

    const dispatch = ReactRedux.useDispatch();

    const onComplete = (response) => {
        if(_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_success", message: 'Widget has been saved successfully', type: "success"}]}});
            Fetch(redirect, true);
        } else
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error"}]}});
    };

    const selectTemplate = (template) => {
        setTemplate(template);

        let cols = [];

        if(template === 12 || !template)
            cols = [12];
        else {
            let sNumber = template.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                cols.push(+sNumber.charAt(i));
            }
        }

        let tmpCols = [];
        cols.forEach((c, i) => {
            if(columns[i] !== undefined) {
                tmpCols[i] = {...columns[i], number: c};
            } else {
                tmpCols[i] = {number: c}
            }
        });

        setColumns(tmpCols);
    };

    if(areaProps.type !== 'area')
        return null;

    return <div className="mt-4">
        <Form
            id="area-widget-edit-form"
            action={formAction}
            onComplete={onComplete}
            submitText={null}
        >
            <div className="row">
                <div className="col-8">
                    <div className="sml-block">
                        <div className="sml-block-title">Area widget</div>
                        <input type='text' name="query" value="mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}" readOnly style={{display:'none'}}/>
                        <input type='text' name="variables[widget][type]" value="area" readOnly style={{display:'none'}}/>
                        {id && <input type='text' name="variables[widget][id]" value={id} readOnly style={{display:'none'}}/>}
                        <Text
                            name="variables[widget][name]"
                            value={name}
                            formId="area-widget-edit-form"
                            validation_rules={['notEmpty']}
                            label={"Name"}
                        />
                        <Switch
                            name="variables[widget][status]"
                            value={status}
                            formId="area-widget-edit-form"
                            label="Status"
                        />
                        <input type='text' name="variables[widget][setting][0][key]" value="id" readOnly style={{display:'none'}}/>
                        <Text
                            formId={"area-widget-edit-form"}
                            validation_rules={["notEmpty"]}
                            name={"variables[widget][setting][0][value]"}
                            value={areaId}
                            handler={(e) => setAreaId(e.target.value)}
                            label={"Area ID"}
                        />
                        <input type='text' name="variables[widget][setting][1][key]" value="container_class" readOnly style={{display:'none'}}/>
                        <Text
                            name="variables[widget][setting][1][value]"
                            value={_.find(setting, {key:'container_class'}) !== undefined ? _.get(_.find(setting, {key:'container_class'}), 'value', 'row') : 'row'}
                            formId="area-widget-edit-form"
                            label={"Container class"}
                        />
                        <input type='text' name="variables[widget][setting][2][key]" value="template" readOnly style={{display:'none'}}/>
                        <input type='text' name="variables[widget][setting][2][value]" readOnly style={{display:'none'}} value={template}/>
                        <Templates template={template} selectTemplate={selectTemplate}/>

                        <input type='text' name="variables[widget][setting][3][key]" value="columns" readOnly style={{display:'none'}}/>
                        <input type='text' name="variables[widget][setting][3][value]" readOnly style={{display:'none'}} value={JSON.stringify(columns)}/>

                        <ColumnsSetting template={template} _columns={columns} setColumns={setColumns} id={areaId}/>
                        <div className="mt-4 text-right">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="sml-block">
                        <div className="sml-block-title">Select page layout</div>
                        <LayoutList formId={"area-widget-edit-form"} selectedLayouts={layout}/>
                    </div>
                    <div className="sml-block mt-4">
                        <div className="sml-block-title">Select area</div>
                        <AreaList formId={"area-widget-edit-form"} selectedAreas={area} manualInputAreas={manualInputAreas}/>
                        <Text
                            name="variables[widget][sort_order]"
                            value={sort_order}
                            formId="area-widget-edit-form"
                            label={"Sort order"}
                        />
                    </div>
                </div>
            </div>
        </Form>
    </div>
}