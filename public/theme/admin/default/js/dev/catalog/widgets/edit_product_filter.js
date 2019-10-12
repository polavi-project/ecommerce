import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import {AreaList} from "../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import {LayoutList} from "../../../production/cms/widget/layout_list.js";
import Radio from "../../../../../../../js/production/form/fields/radio.js";

export default function ProductFilter({id, name, status, setting = [], displaySetting, sortOrder, formAction, areaProps}) {
    const layout = _.find(displaySetting, {key:'layout'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'layout'}), 'value', [])) : [];

    const area = _.find(displaySetting, {key:'area'}) !== undefined ?
        JSON.parse(_.get(_.find(displaySetting, {key:'area'}), 'value', [])) : [];

    const dispatch = ReactRedux.useDispatch();

    const onComplete = (response) => {
        if(_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_success", message: 'Widget has been saved successfully', type: "success"}]}});
            Fetch(areaProps.requestUrl, true);
        } else
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error"}]}});
    };

    return <div>
        <Form
            id="product-filter-widget-edit-form"
            action={formAction}
            onComplete={onComplete}
        >
            <input type='text' name="query" value="mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}" readOnly style={{display:'none'}}/>
            <input type='text' name="variables[widget][type]" value="product_filter" readOnly style={{display:'none'}}/>
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
            <input type='text' name="variables[widget][setting][0][key]" value="title" readOnly style={{display:'none'}}/>
            <Text
                name="variables[widget][setting][0][value]"
                value={_.get(_.find(setting, {key:'title'}), 'value', "")}
                formId="product-filter-widget-edit-form"
                validation_rules={['notEmpty']}
                label="Title"
            />
            <input type='text' name="variables[widget][setting][1][key]" value="show_count" readOnly style={{display:'none'}}/>
            <div><span>Show product count?</span></div>
            <Radio
                name="variables[widget][setting][1][value]"
                value={_.get(_.find(setting, {key:'show_count'}), 'value', '')}
                formId="product-filter-widget-edit-form"
                validation_rules={['notEmpty']}
                options={[
                    {value: '1', text: 'Yes'},
                    {value: '0', text: 'No'}
                ]}
            />
            <div>Select page layout</div>
            <LayoutList formId={"text-widget-edit-form"} selectedLayouts={layout}/>
            <div>Select area</div>
            <AreaList formId={"text-widget-edit-form"} selectedAreas={area}/>
            <Text
                name="variables[widget][sort_order]"
                value={sortOrder}
                formId="text-widget-edit-form"
                label={"Sort order"}
            />
        </Form>
    </div>
}