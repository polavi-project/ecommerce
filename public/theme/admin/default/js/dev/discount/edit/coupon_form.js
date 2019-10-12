import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Textarea from "../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import Radio from "../../../../../../../js/production/form/fields/radio.js";
import Area from "../../../../../../../js/production/area.js";
import {FORM_FIELD_CREATED, FORM_FIELD_UPDATED} from "../../../../../../../js/dev/event-types.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";

function General({coupon, status = 1, description, discount_amount, discount_type, free_shipping}) {

    // React.useEffect(() => {
    //     let tokenOne = PubSub.subscribe(FORM_FIELD_CREATED, function(message, data) {
    //         console.log(data);
    //     });
    //
    //     return function cleanup() {
    //         PubSub.unsubscribe(tokenOne);
    //     };
    // });
    return <div className="uk-column-1-2">
        <Area
            id={"coupon-general-content"}
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: "coupon",
                        value: coupon,
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Coupon code"
                    },
                    'sort_order': 10,
                    'id': 'coupon_coupon'
                },
                {
                    'component': Radio,
                    'props': {
                        name: "status",
                        value: status.toString(),
                        options: [
                            {
                                'value' : '1',
                                'text' : 'Enable'
                            },
                            {
                                'value' : '0',
                                'text' : 'Disable'
                            }
                        ],
                        validation_rules: ['notEmpty'],
                        formId: "coupon-edit-form",
                        label: "Status"
                    },
                    'sort_order': 15,
                    'id': 'coupon_status'
                },
                {
                    'component': Textarea,
                    'props': {
                        name: "description",
                        value: description,
                        formId: "coupon-edit-form",
                        label: "Description"
                    },
                    'sort_order': 20,
                    'id': 'coupon_description'
                },
                {
                    'component': Text,
                    'props': {
                        name: "discount_amount",
                        value: discount_amount,
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
                        value: free_shipping,
                        formId: "coupon-edit-form",
                        label: "Free shipping?"
                    },
                    'sort_order': 30,
                    'id': 'coupon_free_shipping'
                },
                {
                    'component': Radio,
                    'props': {
                        name: "discount_type",
                        value: discount_type,
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
                                'value' : 'by_x_get_y',
                                'text' : 'By X get Y'
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

function RequiredProducts({requiredProducts: requiredProducts}) {
    const [products, setProducts] = React.useState(requiredProducts);

    const addProduct = (e) => {
        e.persist();
        e.preventDefault();
        setProducts(products.concat({
            sku: "",
            qty: ""
        }));
    };

    const removeProduct = (e, index) => {
        e.persist();
        e.preventDefault();
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    return <div>
        <div><span>Order must contains bellow products</span></div>
        <table className="uk-table uk-table-small">
            <thead>
            <tr>
                <th><span>Sku</span></th>
                <th><span>Minimum quantity</span></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { products.map((p,i) => {
                return <tr key={i}>
                    <td><Text
                        name={`condition[required_product][${i}][sku]`}
                        formId={"coupon-edit-form"}
                        value={p.sku}
                        validation_rules={['notEmpty']}
                    /></td>
                    <td><Text
                        name={`condition[required_product][${i}][qty]`}
                        formId={"coupon-edit-form"}
                        value={p.qty}
                        validation_rules={['notEmpty']}
                    /></td>
                    <td><a onClick={(e) => removeProduct(e, i)}>Remove</a></td>
                </tr>
            })}
            </tbody>
        </table>
        <a onClick={(e) => addProduct(e)}>Add product</a>
    </div>
}

function BuyXGetY({_products}) {
    const [products, setProducts] = React.useState(_products);
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_FIELD_UPDATED, function(message, data) {
            if(
                data.name === "discount_type"
                && data.value === "by_x_get_y") {
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
            x: "",
            y: "",
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

    return <div>
        {active && <div>
            <div><span>Buy X get Y</span></div>
            <table className="uk-table uk-table-small">
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
                            name={`buyx_gety[${i}][x]`}
                            formId={"coupon-edit-form"}
                            value={p.x}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][y]`}
                            formId={"coupon-edit-form"}
                            value={p.y}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][max_y]`}
                            formId={"coupon-edit-form"}
                            value={p.max_y}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><Text
                            name={`buyx_gety[${i}][discount]`}
                            formId={"coupon-edit-form"}
                            value={p.discount}
                            validation_rules={['notEmpty']}
                        /></td>
                        <td><a onClick={(e) => removeProduct(e, i)}>Remove</a></td>
                    </tr>
                })}
                </tbody>
            </table>
            <a onClick={(e) => addProduct(e)}>Add product</a>
        </div>}
    </div>
}

function OrderCondition(props) {
    return <div>
        <div><span>Order condition</span></div>
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
    return <div>
        <div><span>Customer condition</span></div>
        <Text
            name='customer_condition[order_total]'
            label="Minimum purchase amount"
            value={props.order_total ? props.order_total : ''}
        />
        <Text
            name='customer_condition[order_qty]'
            label="Minimum purchase qty"
            value={props.order_qty ? props.order_qty : ''}
        />
    </div>
}

function TargetProduct({products,discount_type}) {
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

    return <div>
        { active === true && <div>
            <Text
                name={"target_products"}
                value={products}
                validation_rules={['notEmpty']}
                formId={"coupon-edit-form"}
                label={"Target products"}
                comment={"Use comma to separate in case multiple products"}
            />
        </div>}
    </div>
}

export default function CouponForm(props) {
    const condition = props.condition ? JSON.parse(props.condition) : {};
    const buyx_gety = props.buyx_gety ? JSON.parse(props.buyx_gety) : [];
    return <div className="uk-grid uk-grid-small uk-child-width-expand@s">
        <Form id={"coupon-edit-form"} {...props}>
            <Area
                id={"coupon-general"}
                coreWidgets={[
                    {
                        component: General,
                        props: props,
                        sort_order: 10,
                        id: "coupon-general"
                    },
                    {
                        component: OrderCondition,
                        props: condition,
                        sort_order: 20,
                        id: "coupon-order-condition"
                    },
                    {
                        component: TargetProduct,
                        props: {products: props.target_products ? props.target_products : "", "discount_type": props.discount_type},
                        sort_order: 30,
                        id: "coupon-order-target-products"
                    },
                    {
                        component: BuyXGetY,
                        props: {_products: buyx_gety},
                        sort_order: 30,
                        id: "coupon-order-buyx_gety"
                    }
                ]}
            />
        </Form>
    </div>
}