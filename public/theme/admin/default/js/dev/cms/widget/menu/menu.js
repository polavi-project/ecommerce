import Text from "../../../../../../../../js/production/form/fields/text.js";
import Tinycme from "../../../../../../../../js/production/form/fields/tinycme.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import {LayoutList} from "../../../../production/cms/widget/layout_list.js";
import {AreaList} from "../../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function Categories({categories = [], setting = []}) {
    const[cs, setCs] = React.useState(()=> {
        return _.find(setting, {key:'category'}) !== undefined ? JSON.parse(_.get(_.find(setting, {key:'category'}), 'value', "[]")) : [];
    });

    const onChangePosition = (id, p) => {
        setCs(cs.map((c) => {
            if(parseInt(c.id) === parseInt(id))
                c.position = parseInt(p);
            return c;
        }));
    };

    const onChange = (e, id) => {
        if(e.target.checked)
            setCs(cs.concat({id: id, position: 0}));
        else
            setCs(cs.filter((c) => {
                return parseInt(c.id) !== parseInt(id);
            }));
    };
    return <div className="uk-width-1-2">
        <h3>Categories</h3>
        <input type='text' name="variables[widget][setting][0][key]" value="category" readOnly style={{display:'none'}}/>
        <input type='hidden' name="variables[widget][setting][0][value]" value={JSON.stringify(cs)}/>
        <ul className="uk-list">
            {categories.map((c, i)  => {
                return <li key={i}>
                    <label>
                        <input
                            type="checkbox"
                            checked={_.find(cs, {id: c.category_id}) !== undefined}
                            onChange={(e) => onChange(e, c.category_id)}
                        /> {c.name}
                    </label>
                    <br/>
                    <label>
                        Position <input
                            type="text"
                            value={_.find(cs, {id: c.category_id}) !== undefined ? _.get(_.find(cs, {id: c.category_id}), 'position', "") : ""}
                            onChange={(e) => {onChangePosition(c.category_id, e.target.value)}}
                        />
                    </label>
                </li>
            })}
        </ul>
    </div>
}

function Pages({pages = [], setting = []}) {
    const[ps, setPs] = React.useState(()=> {
        return _.find(setting, {key:'page'}) !== undefined ? JSON.parse(_.get(_.find(setting, {key:'page'}), 'value', "[]")) : [];
    });

    const onChangePosition = (id, _p) => {
        setCs(ps.map((p) => {
            if(parseInt(p.id) === parseInt(id))
                p.position = parseInt(_p);
            return p;
        }));
    };

    const onChange = (e, id) => {
        if(e.target.checked)
            setPs(ps.concat({id: id, position: 0}));
        else
            setPs(ps.filter((p) => {
                return parseInt(p.id) !== parseInt(id);
            }));
    };
    return <div className="uk-width-1-2">
        <h3>Cms pages</h3>
        <input type='text' name="variables[widget][setting][1][key]" value="page" readOnly style={{display:'none'}}/>
        <input type='hidden' name="variables[widget][setting][1][value]" value={JSON.stringify(ps)}/>
        <ul className="uk-list">
            {pages.map((p, i)  => {
                return <li key={i}>
                    <label>
                        <input
                            type="checkbox"
                            checked={_.find(ps, {id: p.cms_page_id}) !== undefined}
                            onChange={(e) => onChange(e, p.cms_page_id)}
                        /> {p.name}
                    </label>
                    <br/>
                    <label>
                        Position <input
                        type="text"
                        value={_.find(ps, {id: p.cms_page_id}) !== undefined ? _.get(_.find(ps, {id: p.cms_page_id}), 'position', "") : ""}
                        onChange={(e) => {onChangePosition(c.cms_page_id, e.target.value)}}
                    />
                    </label>
                </li>
            })}
        </ul>
    </div>
}

export default function MenuWidget({id, name, status, setting, displaySetting, sort_order, formAction, areaProps, categories, pages}) {
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
            id="text-widget-edit-form"
            action={formAction}
            onComplete={onComplete}
        >
            <input type='text' name="query" value="mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}" readOnly style={{display:'none'}}/>
            <input type='text' name="variables[widget][type]" value="menu" readOnly style={{display:'none'}}/>
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
            <Categories categories={categories} setting={setting}/>
            <Pages pages={pages} setting={setting}/>
            <div>Select page layout</div>
            <LayoutList formId={"text-widget-edit-form"} selectedLayouts={layout}/>
            <div>Select area</div>
            <AreaList formId={"text-widget-edit-form"} selectedAreas={area}/>
            <Text
                name="variables[widget][sort_order]"
                value={sort_order}
                formId="text-widget-edit-form"
                label={"Sort order"}
            />
        </Form>
    </div>
}