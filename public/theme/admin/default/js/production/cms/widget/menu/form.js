import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import { LayoutList } from "../../../../production/cms/widget/layout_list.js";
import { AreaList } from "../../../../production/cms/widget/area_list.js";
import { Form } from "../../../../../../../../js/production/form/form.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function Categories({ categories = [], setting = [] }) {
    const [cs, setCs] = React.useState(() => {
        return _.find(setting, { key: 'category' }) !== undefined ? JSON.parse(_.get(_.find(setting, { key: 'category' }), 'value', "[]")) : [];
    });

    const onChangePosition = (id, p) => {
        setCs(cs.map(c => {
            if (parseInt(c.id) === parseInt(id)) c.position = parseInt(p);
            return c;
        }));
    };

    const onChange = (e, id) => {
        if (e.target.checked) setCs(cs.concat({ id: id, position: 0 }));else setCs(cs.filter(c => {
            return parseInt(c.id) !== parseInt(id);
        }));
    };

    return React.createElement(
        "div",
        { className: "uk-width-1-2 uk-margin-medium-top" },
        React.createElement(
            "h3",
            null,
            "Categories"
        ),
        React.createElement("input", { type: "text", name: "variables[widget][setting][0][key]", value: "category", readOnly: true, style: { display: 'none' } }),
        React.createElement("input", { type: "hidden", name: "variables[widget][setting][0][value]", value: JSON.stringify(cs) }),
        React.createElement(
            "ul",
            { className: "uk-list" },
            categories.map((c, i) => {
                return React.createElement(
                    "li",
                    { key: i },
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", {
                            type: "checkbox",
                            className: "uk-checkbox",
                            checked: _.find(cs, { id: c.category_id }) !== undefined,
                            onChange: e => onChange(e, c.category_id)
                        }),
                        " ",
                        c.name
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        "Position ",
                        React.createElement("input", {
                            type: "text",
                            className: "uk-input uk-form-small uk-form-width-small",
                            value: _.find(cs, { id: c.category_id }) !== undefined ? _.get(_.find(cs, { id: c.category_id }), 'position', "") : "",
                            onChange: e => {
                                onChangePosition(c.category_id, e.target.value);
                            }
                        })
                    )
                );
            })
        )
    );
}

function Pages({ pages = [], setting = [] }) {
    const [ps, setPs] = React.useState(() => {
        return _.find(setting, { key: 'page' }) !== undefined ? JSON.parse(_.get(_.find(setting, { key: 'page' }), 'value', "[]")) : [];
    });

    const onChangePosition = (id, _p) => {
        setCs(ps.map(p => {
            if (parseInt(p.id) === parseInt(id)) p.position = parseInt(_p);
            return p;
        }));
    };

    const onChange = (e, id) => {
        if (e.target.checked) setPs(ps.concat({ id: id, position: 0 }));else setPs(ps.filter(p => {
            return parseInt(p.id) !== parseInt(id);
        }));
    };
    return React.createElement(
        "div",
        { className: "uk-width-1-2 uk-margin-medium-top" },
        React.createElement(
            "h3",
            null,
            "Cms pages"
        ),
        React.createElement("input", { type: "text", name: "variables[widget][setting][1][key]", value: "page", readOnly: true, style: { display: 'none' } }),
        React.createElement("input", { type: "hidden", name: "variables[widget][setting][1][value]", value: JSON.stringify(ps) }),
        React.createElement(
            "ul",
            { className: "uk-list" },
            pages.map((p, i) => {
                return React.createElement(
                    "li",
                    { key: i },
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", {
                            type: "checkbox",
                            className: "uk-checkbox",
                            checked: _.find(ps, { id: p.cms_page_id }) !== undefined,
                            onChange: e => onChange(e, p.cms_page_id)
                        }),
                        " ",
                        p.name
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        "Position ",
                        React.createElement("input", {
                            type: "text",
                            className: "uk-input uk-form-small uk-form-width-small",
                            value: _.find(ps, { id: p.cms_page_id }) !== undefined ? _.get(_.find(ps, { id: p.cms_page_id }), 'position', "") : "",
                            onChange: e => {
                                onChangePosition(c.cms_page_id, e.target.value);
                            }
                        })
                    )
                );
            })
        )
    );
}

export default function MenuWidget({ id, name, status, setting, displaySetting, sort_order, formAction, redirect, areaProps }) {
    const [categories, setCategories] = React.useState([]);
    const [pages, setPages] = React.useState([]);

    const layout = _.find(displaySetting, { key: 'layout' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'layout' }), 'value', [])) : [];
    const area = _.find(displaySetting, { key: 'area' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'area' }), 'value', [])) : [];

    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        if (_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_success", message: 'Widget has been saved successfully', type: "success" }] } });
            Fetch(redirect, true);
        } else dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error" }] } });
    };

    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    React.useEffect(() => {
        const getCategoriesQuery = "{ categoryCollection { categories { category_id name } }}";
        const getPagesQuery = "{ pageCollection {pages {cms_page_id name } }}";
        fetch(api + "?query=" + getCategoriesQuery, {
            method: "GET"
        }).then(res => res.json()).then(response => {
            setCategories(response.payload.data.categoryCollection.categories);
        }).catch(error => console.log(error));

        fetch(api + "?query=" + getPagesQuery, {
            method: "GET"
        }).then(res => res.json()).then(response => {
            setPages(response.payload.data.pageCollection.pages);
        }).catch(error => console.log(error));
    }, []);

    // TODO: make this form customizable
    if (areaProps.type !== "menu") return null;

    return React.createElement(
        "div",
        { className: "uk-margin-medium-top" },
        React.createElement(
            "h3",
            null,
            "Menu widget"
        ),
        React.createElement(
            Form,
            {
                id: "text-widget-edit-form",
                action: formAction,
                onComplete: onComplete
            },
            React.createElement(
                "div",
                { className: "uk-child-width-1-2 uk-grid" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { type: "text", name: "query", value: "mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}", readOnly: true, style: { display: 'none' } }),
                    React.createElement("input", { type: "text", name: "variables[widget][type]", value: "menu", readOnly: true, style: { display: 'none' } }),
                    id && React.createElement("input", { type: "text", name: "variables[widget][id]", value: id, readOnly: true, style: { display: 'none' } }),
                    React.createElement(Text, {
                        name: "variables[widget][name]",
                        value: name,
                        formId: "text-widget-edit-form",
                        validation_rules: ['notEmpty'],
                        label: "Name"
                    }),
                    React.createElement(Select, {
                        name: "variables[widget][status]",
                        value: status,
                        formId: "text-widget-edit-form",
                        options: [{ value: '1', text: 'Enable' }, { value: '0', text: 'Disable' }],
                        label: "Status",
                        size: "medium"
                    }),
                    React.createElement(Categories, { categories: categories, setting: setting }),
                    React.createElement(Pages, { pages: pages, setting: setting })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "h3",
                        null,
                        "Select page layout"
                    ),
                    React.createElement(LayoutList, { formId: "text-widget-edit-form", selectedLayouts: layout }),
                    React.createElement(
                        "h3",
                        null,
                        "Select area"
                    ),
                    React.createElement(AreaList, { formId: "text-widget-edit-form", selectedAreas: area }),
                    React.createElement(Text, {
                        name: "variables[widget][sort_order]",
                        value: sort_order,
                        formId: "text-widget-edit-form",
                        label: "Sort order"
                    })
                )
            )
        )
    );
}