import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Textarea from "../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import Radio from "../../../../../../../js/production/form/fields/radio.js";
import Area from "../../../../../../../js/production/area.js";
import {FORM_FIELD_CREATED, FORM_FIELD_UPDATED} from "../../../../../../../js/dev/event-types.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import Datetime from "../../../../../../../js/production/form/fields/datetime.js";
import Switch from "../../../../../../../js/production/form/fields/switch.js";
import A from "../../../../../../../js/production/a.js";

function StartEnd({start_date = "", end_date = ""}) {
    return <div className="row">
        <div className="col-6">
            <Datetime
                name={"start_date"}
                formId={"coupon-edit-form"}
                label={"Start time"}
                value={start_date}
            />
        </div>
        <div className="col-6">
            <Datetime
                name={"end_date"}
                formId={"coupon-edit-form"}
                label={"End time"}
                value={end_date}
            />
        </div>
    </div>
}

function GeneralLeft(props) {
    return <div className="col-6">
        <Area
            id={"coupon-general-content"}
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: "coupon",
                        value: _.get(props, 'coupon'),
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Coupon code"
                    },
                    'sort_order': 10,
                    'id': 'coupon_coupon'
                },
                {
                    'component': Switch,
                    'props': {
                        name: "status",
                        value: _.get(props, 'status', 1).toString(),
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Status"
                    },
                    'sort_order': 15,
                    'id': 'coupon_status'
                },
                {
                    'component': StartEnd,
                    'props': {
                        start_date: _.get(props, 'start_date'),
                        end_date: _.get(props, 'end_date'),
                    },
                    'sort_order': 20,
                    'id': 'start_end'
                },
                {
                    'component': Textarea,
                    'props': {
                        name: "description",
                        value: _.get(props, 'description'),
                        formId: "coupon-edit-form",
                        label: "Description",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 30,
                    'id': 'coupon_description'
                }
            ]}
        />
    </div>
}

function GeneralRight(props) {
    return <div className="col-6">
        <Area
            id={"coupon-general-content"}
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: "discount_amount",
                        value: _.get(props, 'discount_amount'),
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Discount amount"
                    },
                    'sort_order': 30,
                    'id': 'coupon_discount_amount'
                },
                {
                    'component': Checkbox,
                    'props': {
                        name: "free_shipping",
                        value: _.get(props, 'free_shipping'),
                        formId: "coupon-edit-form",
                        label: "Free shipping?",
                        isChecked: _.get(props, 'free_shipping') === 1
                    },
                    'sort_order': 30,
                    'id': 'coupon_free_shipping'
                },
                {
                    'component': Radio,
                    'props': {
                        name: "discount_type",
                        value: _.get(props, 'discount_type'),
                        options: [
                            {
                                'value' : 'fixed_discount_to_entire_order',
                                'text' : 'Fixed discount to entire order'
                            },
                            {
                                'value' : 'percentage_discount_to_entire_order',
                                'text' : 'Percentage discount to entire order'
                            },
                            {
                                'value' : 'fixed_discount_to_specific_products',
                                'text' : 'Fixed discount to specific products'
                            },
                            {
                                'value' : 'percentage_discount_to_specific_products',
                                'text' : 'Percentage discount to specific products'
                            },
                            {
                                'value' : 'buy_x_get_y',
                                'text' : 'Buy X get Y'
                            }
                        ],
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Discount type"
                    },
                    'sort_order': 40,
                    'id': 'coupon_discount_type'
                }
            ]}
        />
    </div>
}

function General(props) {
    return <div className="col-12">
        <div className="sml-block">
            <div className="sml-block-title">General</div>
            <Area
                id={"coupon-general-content"}
                className="row"
                coreWidgets={[
                    {
                        'component': GeneralLeft,
                        'props': {...props},
                        'sort_order': 10,
                        'id': 'general_left'
                    },
                    {
                        'component': GeneralRight,
                        'props': {...props},
                        'sort_order': 15,
                        'id': 'general_right'
                    }
                ]}
            />
        </div>
    </div>
}

function RequiredProducts({requiredProducts}) {
    const [products, setProducts] = React.useState(requiredProducts);

    const addProduct = (e) => {
        e.persist();
        e.preventDefault();
        setProducts(products.concat({
            key: "",
            operator: "",
            value: "",
            qty: ""
        }));
    };

    const removeProduct = (e, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const updateProduct = (e, key, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.map((p, i) => {
            if(i === index) {
                return {...p, [key]: e.target.value}
            } else
                return p;
        });
        setProducts(newProducts);
    };

    return <div>
        <div><span>Order must contains product matched bellow conditions(All)</span></div>
        <table className="table table-bordered" style={{"marginTop": 0}}>
            <thead>
            <tr>
                <th><span>Key</span></th>
                <th><span>Operator</span></th>
                <th><span>Value</span></th>
                <th><span>Minimum quantity</span></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { products.map((p,i) => {
                return <tr key={i}>
                    <td>
                        <select
                            name={`condition[required_product][${i}][key]`}
                            className={"form-control"}
                            value={p.key}
                            onChange={(e) => updateProduct(e, 'key', i)}
                        >
                            <Area
                                id="coupon_required_product_key_list"
                                noOuter={true}
                                coreWidgets={[
                                    {
                                        component: ()=>{ return <option value="category">CategoryId</option>;},
                                        props : {},
                                        sort_order: 10,
                                        id: "required_product_key_category"
                                    },
                                    {
                                        component: ()=>{ return <option value="attribute_group">Attribute Group</option>;},
                                        props : {},
                                        sort_order: 20,
                                        id: "required_product_key_attribute_group"
                                    },
                                    {
                                        component: ()=><option value="price">Price</option>,
                                        props : {},
                                        sort_order: 30,
                                        id: "required_product_key_price"
                                    },
                                    {
                                        component: ()=><option value="sku">Sku</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "required_product_key_sku"
                                    }
                                ]}
                            />
                        </select>
                    </td>
                    <td>
                        <select
                            name={`condition[required_product][${i}][operator]`}
                            className={"form-control"}
                            value={p.operator}
                            onChange={(e) => updateProduct(e, 'operator', i)}
                        >
                            <Area
                                id="coupon_required_product_operator_list"
                                noOuter={true}
                                coreWidgets={[
                                    {
                                        component: ()=><option value="=">Equal</option>,
                                        props : {},
                                        sort_order: 10,
                                        id: "coupon_required_product_operator_equal"
                                    },
                                    {
                                        component: ()=><option value="<>">Not equal</option>,
                                        props : {},
                                        sort_order: 10,
                                        id: "coupon_required_product_operator_equal"
                                    },
                                    {
                                        component: ()=><option value=">">Greater</option>,
                                        props : {},
                                        sort_order: 20,
                                        id: "coupon_required_product_operator_greater"
                                    },
                                    {
                                        component: ()=><option value=">=">Greater or equal</option>,
                                        props : {},
                                        sort_order: 30,
                                        id: "coupon_required_product_operator_greater_or_equal"
                                    },
                                    {
                                        component: ()=><option value="<">Smaller</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_required_product_operator_smaller"
                                    },
                                    {
                                        component: ()=><option value="<=">Equal or smaller</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_required_product_operator_equal_or_smaller"
                                    },
                                    {
                                        component: ()=><option value="IN">In</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_required_product_operator_in"
                                    },
                                    {
                                        component: ()=><option value="NOT IN">Not in</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_required_product_operator_not_in"
                                    }
                                ]}
                            />
                        </select>
                    </td>
                    <td>
                        <Text
                            name={`condition[required_product][${i}][value]`}
                            formId={"coupon-edit-form"}
                            value={p.value}
                            validation_rules={['notEmpty']}
                        />
                    </td>
                    <td>
                        <Text
                            name={`condition[required_product][${i}][qty]`}
                            formId={"coupon-edit-form"}
                            value={p.qty}
                            validation_rules={['notEmpty']}
                        />
                    </td>
                    <td><a href="javascript:void(0);" className="text-danger" onClick={(e) => removeProduct(e, i)}><i className="fas fa-trash-alt"></i></a></td>
                </tr>
            })}
            </tbody>
        </table>
        <a href="javascript:void(0);" onClick={(e) => addProduct(e)}><i className="fas fa-plus-circle"></i> Add condition</a>
    </div>
}

function TargetProducts({targetProducts, maxQty = ""}) {
    const [products, setProducts] = React.useState(targetProducts);
    const [maxQuantity, setMaxQuantity] = React.useState(maxQty);

    const addProduct = (e) => {
        e.persist();
        e.preventDefault();
        setProducts(products.concat({
            key: "",
            operator: "",
            value: "",
            qty: ""
        }));
    };

    const removeProduct = (e, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const updateProduct = (e, key, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.map((p, i) => {
            if(i === index) {
                return {...p, [key]: e.target.value}
            } else
                return p;
        });
        setProducts(newProducts);
    };

    return <div>
        <div className={"mb-3"}><span>Maximum <input style={{display: "inline", width: "50px"}} name={"target_products[maxQty]"} type="text" value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value)} className="form-control"/> quantity of products are matched bellow conditions(All)</span></div>
        <table className="table table-bordered" style={{"marginTop": 0}}>
            <thead>
            <tr>
                <th><span>Key</span></th>
                <th><span>Operator</span></th>
                <th><span>Value</span></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { products.map((p,i) => {
                return <tr key={i}>
                    <td>
                        <select
                            name={`target_products[products][${i}][key]`}
                            className={"form-control"}
                            value={p.key}
                            onChange={(e) => updateProduct(e, 'key', i)}
                        >
                            <Area
                                id="coupon_target_product_key_list"
                                noOuter={true}
                                coreWidgets={[
                                    {
                                        component: ()=>{ return <option value="category">CategoryId</option>;},
                                        props : {},
                                        sort_order: 10,
                                        id: "target_product_key_category"
                                    },
                                    {
                                        component: ()=>{ return <option value="attribute_group">Attribute Group</option>;},
                                        props : {},
                                        sort_order: 20,
                                        id: "target_product_key_attribute_group"
                                    },
                                    {
                                        component: ()=><option value="price">Price</option>,
                                        props : {},
                                        sort_order: 30,
                                        id: "target_product_key_price"
                                    },
                                    {
                                        component: ()=><option value="sku">Sku</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "target_product_key_sku"
                                    }
                                ]}
                            />
                        </select>
                    </td>
                    <td>
                        <select
                            name={`target_products[products][${i}][operator]`}
                            className={"form-control"}
                            value={p.operator}
                            onChange={(e) => updateProduct(e, 'operator', i)}
                        >
                            <Area
                                id="coupon_target_product_operator_list"
                                noOuter={true}
                                coreWidgets={[
                                    {
                                        component: ()=><option value="=">Equal</option>,
                                        props : {},
                                        sort_order: 10,
                                        id: "coupon_target_product_operator_equal"
                                    },
                                    {
                                        component: ()=><option value="<>">Not equal</option>,
                                        props : {},
                                        sort_order: 10,
                                        id: "coupon_target_product_operator_equal"
                                    },
                                    {
                                        component: ()=><option value=">">Greater</option>,
                                        props : {},
                                        sort_order: 20,
                                        id: "coupon_target_product_operator_greater"
                                    },
                                    {
                                        component: ()=><option value=">=">Greater or equal</option>,
                                        props : {},
                                        sort_order: 30,
                                        id: "coupon_target_product_operator_greater_or_equal"
                                    },
                                    {
                                        component: ()=><option value="<">Smaller</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_target_product_operator_smaller"
                                    },
                                    {
                                        component: ()=><option value="<=">Equal or smaller</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_target_product_operator_equal_or_smaller"
                                    },
                                    {
                                        component: ()=><option value="IN">In</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_target_product_operator_in"
                                    },
                                    {
                                        component: ()=><option value="NOT IN">Not in</option>,
                                        props : {},
                                        sort_order: 40,
                                        id: "coupon_target_product_operator_not_in"
                                    }
                                ]}
                            />
                        </select>
                    </td>
                    <td>
                        <Text
                            name={`target_products[products][${i}][value]`}
                            formId={"coupon-edit-form"}
                            value={p.value}
                            validation_rules={['notEmpty']}
                        />
                    </td>
                    <td><a href="javascript:void(0);" className="text-danger" onClick={(e) => removeProduct(e, i)}><i className="fas fa-trash-alt"></i></a></td>
                </tr>
            })}
            </tbody>
        </table>
        <a href="javascript:void(0);" onClick={(e) => addProduct(e)}><i className="fas fa-plus-circle"></i> Add condition</a>
    </div>
}

function BuyXGetY({_products, discount_type}) {
    const [products, setProducts] = React.useState(_products);
    const [active, setActive] = React.useState(() => {
        if(discount_type === "buy_x_get_y") {
            return true;
        } else {
            return false;
        }
    });

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_FIELD_UPDATED, function(message, data) {
            if(
                data.name === "discount_type"
                && data.value === "buy_x_get_y") {
                setActive(true);
            } else {
                setActive(false);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);
    const addProduct = (e) => {
        e.persist();
        e.preventDefault();
        setProducts(products.concat({
            sku: "",
            buy_qty: "",
            get_qty: "",
            max_y: "",
            discount: 100
        }));
    };

    const removeProduct = (e, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    return <React.Fragment>
        {active && <div className="sml-block mt-4">
            <div className="sml-block-title"><span>Buy X get Y</span></div>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th><span>Sku</span></th>
                    <th><span>X</span></th>
                    <th><span>Y</span></th>
                    <th><span>Max of Y</span></th>
                    <th><span>Discount percent</span></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                { products.map((p,i) => {
                    return <tr key={i}>
                        <td><Text
                            name={`buyx_gety[${i}][sku]`}
                            formId={"coupon-edit-form"}
                            value={p.sku}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][buy_qty]`}
                            formId={"coupon-edit-form"}
                            value={p.buy_qty}
                            validation_rules={['notEmpty', 'number']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][get_qty]`}
                            formId={"coupon-edit-form"}
                            value={p.get_qty}
                            validation_rules={['notEmpty', 'number']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][max_y]`}
                            formId={"coupon-edit-form"}
                            value={p.max_y}
                            validation_rules={['notEmpty', 'number']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][discount]`}
                            formId={"coupon-edit-form"}
                            value={p.discount}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><a className="text-danger" href="javascript:void(0);" onClick={(e) => removeProduct(e, i)}><i className="fas fa-trash-alt"></i></a></td>
                    </tr>
                })}
                </tbody>
            </table>
            <a href="javascript:void(0);" onClick={(e) => addProduct(e)}><i className="fas fa-plus-circle"></i> Add product</a>
        </div>}
    </React.Fragment>
}

function OrderCondition(props) {
    return <div className="sml-block">
        <div className="sml-block-title">Order condition</div>
        <Text
            name='condition[order_total]'
            label="Minimum purchase amount"
            value={props.order_total ? props.order_total : ''}
        />
        <Text
            name='condition[order_qty]'
            label="Minimum purchase qty"
            value={props.order_qty ? props.order_qty : ''}
        />
        <RequiredProducts requiredProducts={ props.required_product ? props.required_product : []}/>
    </div>
}

function CustomerCondition(props) {
    const customerGroups = ReactRedux.useSelector(state => _.get(state, 'appState.customerGroups'));
    return <div className="sml-block">
        <div className="sml-block-title">Customer condition</div>
        <Area
            id="coupon_customer_condition"
            coreWidgets={[
                {
                    component: Select,
                    props: {
                        name: "user_condition[group]",
                        label: "Customer group",
                        value: props.group ? props.group : 999,
                        options: customerGroups
                    },
                    sort_order: 10,
                    id: "coupon_customer_condition_group"
                },
                {
                    component: Text,
                    props: {
                        name: "user_condition[email]",
                        label: "Customer email",
                        value: props.email ? props.email : '',
                        validation_rules: ['email'],
                        comment: "Use comma when you have multi email"
                    },
                    sort_order: 20,
                    id: "coupon_customer_condition_email"
                },
                {
                    component: Text,
                    props: {
                        name: "user_condition[purchased]",
                        label: "Customer's purchase",
                        value: props.purchased ? props.purchased : '',
                        validation_rules: ['number'],
                        comment: "Minimum purchased amount"
                    },
                    sort_order: 30,
                    id: "coupon_customer_condition_purchased"
                }
            ]}
        />
    </div>
}

function TargetProduct({products, maxQty, discount_type}) {
    const [active, setActive] = React.useState(() => {
        if(discount_type === "fixed_discount_to_specific_products" || discount_type === "percentage_discount_to_specific_products") {
            return true;
        } else {
            return false;
        }
    });

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_FIELD_UPDATED, function(message, data) {
            if(
                data.name === "discount_type"
                && (data.value === "fixed_discount_to_specific_products" || data.value === "percentage_discount_to_specific_products")) {
                setActive(true);
            } else {
                setActive(false);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    return <React.Fragment>
        { active === true && <div className="sml-block mt-4">
            <div className="sml-block-title">Target products</div>
            <TargetProducts targetProducts={ products} maxQty={maxQty}/>
        </div>}
    </React.Fragment>
}

export default function CouponForm(props) {
    let condition = {};
    if(props.condition)
        try{
            condition = JSON.parse(props.condition);
        } catch(e) {
            condition = {};
        }
    let target_products = {};
    if(props.target_products)
        try{
            target_products = JSON.parse(props.target_products);
        } catch(e) {
            target_products = {};
        }
    let user_condition = {};
    if(props.user_condition)
        try{
            user_condition = JSON.parse(props.user_condition);
        } catch(e) {
            user_condition = {};
        }
    let buyx_gety = [];
    if(props.buyx_gety)
        try{
            buyx_gety = JSON.parse(props.buyx_gety);
        } catch(e) {
            buyx_gety = [];
        }
    return <Form
        id={"coupon-edit-form"}
        onComplete={(response) => {
            if(_.get(response, 'redirect', undefined) !== undefined)
                Fetch(_.get(response, 'redirect', undefined), true);
        }}
        {...props}
        submitText={null}
    >
        <div className="form-head sticky">
            <div className="child-align-middle">
                <A url={props.listUrl} className="">
                    <i className="fas fa-arrow-left"></i>
                    <span className="pl-1">Coupons</span>
                </A>
            </div>
            <div className="buttons">
                <A className="btn btn-danger" url={props.cancelUrl}>Cancel</A>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </div>
        <Area
            id={"coupon_edit_general"}
            className="row"
            coreWidgets={[
                {
                    component: General,
                    props: props,
                    sort_order: 10,
                    id: "coupon-general"
                }
            ]}
        />
        <div className="row mt-4">
            <Area
                id={"coupon_edit_left"}
                className="col-8"
                coreWidgets={[
                    {
                        component: OrderCondition,
                        props: condition,
                        sort_order: 20,
                        id: "coupon-order-condition"
                    },
                    {
                        component: TargetProduct,
                        props: {products: _.get(target_products, "products", []), maxQty: _.get(target_products, "maxQty", ""), discount_type: props.discount_type},
                        sort_order: 30,
                        id: "coupon-order-target-products"
                    },
                    {
                        component: BuyXGetY,
                        props: {_products: buyx_gety, discount_type: props.discount_type},
                        sort_order: 30,
                        id: "coupon-order-buyx_gety"
                    }
                ]}
            />
            <Area
                id={"coupon_edit_right"}
                className="col-4"
                coreWidgets={[
                    {
                        component: CustomerCondition,
                        props: user_condition,
                        sort_order: 25,
                        id: "coupon-customer-condition"
                    }
                ]}
            />
        </div>
    </Form>
}