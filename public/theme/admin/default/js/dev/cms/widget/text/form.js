import Text from "../../../../../../../../js/production/form/fields/text.js";
import Tinycme from "../../../../../../../../js/production/form/fields/tinycme.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import {LayoutList} from "../../../../production/cms/widget/layout_list.js";
import {AreaList} from "../../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

export default function TextWidget({id, name, status, setting, displaySetting, sort_order, formAction, redirect, areaProps}) {
    const layout = _.find(displaySetting, {key:'layout'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'layout'}), 'value', [])) : [];
    const area = _.find(displaySetting, {key:'area'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'area'}), 'value', [])) : [];

    const dispatch = ReactRedux.useDispatch();
    const onComplete = (response) => {
        if(_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_success", message: 'Widget has been saved successfully', type: "success"}]}});
            Fetch(redirect, true);
        } else
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error"}]}});
    };

    if(areaProps.type !== 'text')
        return null;

    return <div className="uk-margin-medium-top">
        <Form
            id="text-widget-edit-form"
            action={formAction}
            onComplete={onComplete}
        >
            <h3>Text widget</h3>
            <div className="uk-child-width-1-2 uk-grid">
                <div>
                    <input type='text' name="query" value="mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}" readOnly style={{display:'none'}}/>
                    <input type='text' name="variables[widget][type]" value="text" readOnly style={{display:'none'}}/>
                    {id && <input type='text' name="variables[widget][id]" value={id} readOnly style={{display:'none'}}/>}
                    <Text
                        name="variables[widget][name]"
                        value={name}
                        formId="text-widget-edit-form"
                        validation_rules={['notEmpty']}
                        label={"Name"}
                    />
                    <Select
                        name="variables[widget][status]"
                        value={status}
                        formId="text-widget-edit-form"
                        options={[
                            {value: '1', text: 'Enable'},
                            {value: '0', text: 'Disable'}
                        ]}
                        label="Status"
                    />
                    <input type='text' name="variables[widget][setting][0][key]" value="content" readOnly style={{display:'none'}}/>
                    <Tinycme
                        name="variables[widget][setting][0][value]"
                        value={_.find(setting, {key:'content'}) !== undefined ? _.get(_.find(setting, {key:'content'}), 'value', '') : ''}
                        validation_rules={['notEmpty']}
                        label={"Content"}
                        formId="text-widget-edit-form"
                    />
                    <input type='text' name="variables[widget][setting][1][key]" value="container_class" readOnly style={{display:'none'}}/>
                    <Text
                        name="variables[widget][setting][1][value]"
                        value={_.find(setting, {key:'container_class'}) !== undefined ? _.get(_.find(setting, {key:'container_class'}), 'value', '') : ''}
                        formId="text-widget-edit-form"
                        label={"Container class"}
                    />
                </div>
                <div>
                    <h3>Select page layout</h3>
                    <LayoutList formId={"text-widget-edit-form"} selectedLayouts={layout}/>
                    <h3>Select area</h3>
                    <AreaList formId={"text-widget-edit-form"} selectedAreas={area}/>
                    <Text
                        name="variables[widget][sort_order]"
                        value={sort_order}
                        formId="text-widget-edit-form"
                        label={"Sort order"}
                    />
                </div>
            </div>
        </Form>
    </div>
}