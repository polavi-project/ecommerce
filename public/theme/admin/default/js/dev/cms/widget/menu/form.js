import Text from "../../../../../../../../js/production/form/fields/text.js";
import {LayoutList} from "../../../../production/cms/widget/layout_list.js";
import {AreaList} from "../../../../production/cms/widget/area_list.js";
import {Form} from "../../../../../../../../js/production/form/form.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import Checkbox from "../../../../../../../../js/production/form/fields/checkbox.js";

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

    return <div className="uk-width-1-2 uk-margin-medium-top">
        <h4>Categories</h4>
        <input type='text' name="variables[widget][setting][0][key]" value="category" readOnly style={{display:'none'}}/>
        <input type='hidden' name="variables[widget][setting][0][value]" value={JSON.stringify(cs)}/>
        <ul className="list-unstyled">
            {categories.map((c, i)  => {
                return <li key={i}>
                    <div className="row">
                        <div className="col-8">
                            <Checkbox
                                isChecked={_.find(cs, {id: c.category_id}) !== undefined}
                                value={c.category_id}
                                handler={(e, props) => onChange(e, props.value)}
                                label={c.name}
                            />
                        </div>
                        <div className="col-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={"Position"}
                                value={_.find(cs, {id: c.category_id}) !== undefined ? _.get(_.find(cs, {id: c.category_id}), 'position', "") : ""}
                                onChange={(e) => {onChangePosition(c.category_id, e.target.value)}}
                            />
                        </div>
                    </div>
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
        setPs(ps.map((p) => {
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

    return <div className="">
        <h4>Cms pages</h4>
        <input type='text' name="variables[widget][setting][1][key]" value="page" readOnly style={{display:'none'}}/>
        <input type='hidden' name="variables[widget][setting][1][value]" value={JSON.stringify(ps)}/>
        <ul className="list-unstyled">
            {pages.map((p, i)  => {
                return <li key={i}>
                    <div className="row">
                        <div className="col-8">
                            <Checkbox
                                isChecked={_.find(ps, {id: p.cms_page_id}) !== undefined}
                                value={p.cms_page_id}
                                handler={(e, props) => onChange(e, props.value)}
                                label={p.name}
                            />
                        </div>
                        <div className="col-4">
                            <input
                            type="text"
                            className="form-control"
                            placeholder={"Position"}
                            value={_.find(ps, {id: p.cms_page_id}) !== undefined ? _.get(_.find(ps, {id: p.cms_page_id}), 'position', "") : ""}
                            onChange={(e) => {onChangePosition(p.cms_page_id, e.target.value)}}
                        />
                        </div>
                    </div>
                </li>
            })}
        </ul>
    </div>
}

export default function MenuWidget({id, name, status, setting, displaySetting, sort_order, formAction, redirect, areaProps}) {
    const [categories, setCategories] = React.useState([]);
    const [pages, setPages] = React.useState([]);

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

    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    React.useEffect(()=>{
        const getCategoriesQuery = "{ categoryCollection { categories { category_id name } }}";
        const getPagesQuery = "{ pageCollection {pages {cms_page_id name } }}";
        fetch(
            api + "?query=" + getCategoriesQuery,
            {
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(response => {
                setCategories(response.payload.data.categoryCollection.categories);
            })
            .catch(error => console.log(error));

        fetch(
            api + "?query=" + getPagesQuery,
            {
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(response => {
                setPages(response.payload.data.pageCollection.pages);
            })
            .catch(error => console.log(error));
    }, []);

// TODO: make this form customizable
    if(areaProps.type !== "menu")
        return null;

    return <div className="mt-4">
        <Form
            id="text-widget-edit-form"
            action={formAction}
            onComplete={onComplete}
            submitText={null}
        >
            <div className="row">
                <div className="col-8">
                    <div className="sml-block">
                        <div className="sml-block-title">Menu widget</div>
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
                        <Switch
                            name="variables[widget][status]"
                            value={status}
                            formId="text-widget-edit-form"
                            label="Status"
                        />
                        <div className="row">
                            <div className="col-6">
                                <Categories categories={categories} setting={setting}/>
                            </div>
                            <div className="col-6">
                                <Pages pages={pages} setting={setting}/>
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
                        <AreaList formId={"text-widget-edit-form"} selectedAreas={area} manualInputAreas={manualInputAreas}/>
                        <Text
                            name="variables[widget][sort_order]"
                            value={sort_order}
                            formId="text-widget-edit-form"
                            label={"Sort order"}
                        />
                    </div>
                </div>
            </div>
        </Form>
    </div>
}