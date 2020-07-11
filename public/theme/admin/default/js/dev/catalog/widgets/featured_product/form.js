import Text from "../../../../../../../../js/production/form/fields/text.js";
import {AreaList} from "../../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import {LayoutList} from "../../../../production/cms/widget/layout_list.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

export default function FeaturedProductWidget({id, name, status, setting, displaySetting, sortOrder, formAction, areaProps, redirect}) {
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

    const [products, setProducts] = React.useState(_.get(_.find(setting, {key:'products'}), 'value', ""));

    if(areaProps.type !== "featured_products")
        return null;

    return <div className="mt-4">
        <Form
            id="featured-product-widget-edit-form"
            action={formAction}
            submitText={null}
            onComplete={onComplete}
        >
            <div className="row">
                <div className="col-8">
                    <div className="sml-block">
                        <div className="sml-block-title">Featured product widget</div>
                        <div>
                            <input type='text' name="query" value="mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}" readOnly style={{display:'none'}}/>
                            <input type='text' name="variables[widget][type]" value="featured_products" readOnly style={{display:'none'}}/>
                            {id && <input type='text' name="variables[widget][id]" value={id} readOnly style={{display:'none'}}/>}
                            <Text
                                name="variables[widget][name]"
                                value={name}
                                formId="text-widget-edit-form"
                                validation_rules={['notEmpty']}
                                label={"Name"}
                            />
                            <Switch
                                name="variables[widget][status]"
                                value={status}
                                formId="text-widget-edit-form"
                                label="Status"
                            />
                            <input type='text' name="variables[widget][setting][0][key]" value="products" readOnly style={{display:'none'}}/>
                            <div><span>Products</span></div>
                            <div className="form-field">
                                <input
                                    className="form-control"
                                    name="variables[widget][setting][0][value]"
                                    value={products}
                                    type="text" defaultValue=""
                                    onChange={(e)=>{ setProducts(e.target.value)}}
                                    placeholder={"Product sku"}
                                />
                                <div><i>Support multiple sku, comma separated.</i></div>
                            </div>
                        </div>
                        <div className="mt-4 text-right">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="sml-block">
                        <div className="sml-block-title">Select page layout</div>
                        <LayoutList formId={"text-widget-edit-form"} selectedLayouts={layout}/>
                    </div>
                    <div className="sml-block mt-4">
                        <div className="sml-block-title">Select area</div>
                        <AreaList formId={"text-widget-edit-form"} selectedAreas={area}/>
                        <Text
                            name="variables[widget][sort_order]"
                            value={sortOrder}
                            formId="text-widget-edit-form"
                            label={"Sort order"}
                        />
                    </div>
                </div>
            </div>
        </Form>
    </div>
}