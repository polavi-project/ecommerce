var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Textarea from "../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import Radio from "../../../../../../../js/production/form/fields/radio.js";
import Area from "../../../../../../../js/production/area.js";
import { FORM_FIELD_CREATED, FORM_FIELD_UPDATED } from "../../../../../../../js/dev/event-types.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";

function GeneralLeft(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(Area, {
            id: "coupon-general-content",
            coreWidgets: [{
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
            }, {
                'component': Radio,
                'props': {
                    name: "status",
                    value: _.get(props, 'status', 1).toString(),
                    options: [{
                        'value': '1',
                        'text': 'Enable'
                    }, {
                        'value': '0',
                        'text': 'Disable'
                    }],
                    validation_rules: ['notEmpty'],
                    formId: "coupon-edit-form",
                    label: "Status"
                },
                'sort_order': 15,
                'id': 'coupon_status'
            }, {
                'component': Textarea,
                'props': {
                    name: "description",
                    value: _.get(props, 'description'),
                    formId: "coupon-edit-form",
                    label: "Description"
                },
                'sort_order': 20,
                'id': 'coupon_description'
            }]
        })
    );
}

function GeneralRight(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(Area, {
            id: "coupon-general-content",
            coreWidgets: [{
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
            }, {
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
            }, {
                'component': Radio,
                'props': {
                    name: "discount_type",
                    value: _.get(props, 'discount_type'),
                    options: [{
                        'value': 'fixed_discount_to_entire_order',
                        'text': 'Fixed discount to entire order'
                    }, {
                        'value': 'percentage_discount_to_entire_order',
                        'text': 'Percentage discount to entire order'
                    }, {
                        'value': 'fixed_discount_to_specific_products',
                        'text': 'Fixed discount to specific products'
                    }, {
                        'value': 'percentage_discount_to_specific_products',
                        'text': 'Percentage discount to specific products'
                    }, {
                        'value': 'by_x_get_y',
                        'text': 'By X get Y'
                    }],
                    validation_rules: ['notEmpty'],
                    formId: "coupon-edit-form",
                    label: "Discount type"
                },
                'sort_order': 40,
                'id': 'coupon_discount_type'
            }]
        })
    );
}

function General(props) {

    // React.useEffect(() => {
    //     let tokenOne = PubSub.subscribe(FORM_FIELD_CREATED, function(message, data) {
    //         console.log(data);
    //     });
    //
    //     return function cleanup() {
    //         PubSub.unsubscribe(tokenOne);
    //     };
    // });
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "General"
            )
        ),
        React.createElement(Area, {
            id: "coupon-general-content",
            className: "uk-grid uk-grid-small",
            coreWidgets: [{
                'component': GeneralLeft,
                'props': _extends({}, props),
                'sort_order': 10,
                'id': 'general_left'
            }, {
                'component': GeneralRight,
                'props': _extends({}, props),
                'sort_order': 15,
                'id': 'general_right'
            }]
        })
    );
}

function RequiredProducts({ requiredProducts }) {
    const [products, setProducts] = React.useState(requiredProducts);

    const addProduct = e => {
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
            if (i === index) {
                return _extends({}, p, { [key]: e.target.value });
            } else return p;
        });
        setProducts(newProducts);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Order must contains product matched bellow condition(All)"
            )
        ),
        React.createElement(
            "table",
            { className: "uk-table uk-table-small", style: { "marginTop": 0 } },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Key"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Operator"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Value"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Minimum quantity"
                        )
                    ),
                    React.createElement("th", null)
                )
            ),
            React.createElement(
                "tbody",
                null,
                products.map((p, i) => {
                    return React.createElement(
                        "tr",
                        { key: i },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Area, {
                                id: "coupon_required_product_key_list",
                                reactcomponent: "select",
                                wrapperProps: {
                                    name: `condition[required_product][${i}][key]`,
                                    className: 'uk-select uk-form-small uk-form-width-small',
                                    value: p.key,
                                    onChange: e => updateProduct(e, 'key', i)
                                },
                                coreWidgets: [{
                                    component: () => {
                                        return React.createElement(
                                            "option",
                                            { value: "category" },
                                            "CategoryId"
                                        );
                                    },
                                    props: {},
                                    sort_order: 10,
                                    id: "required_product_key_category"
                                }, {
                                    component: () => {
                                        return React.createElement(
                                            "option",
                                            { value: "attribute_group" },
                                            "Attribute Group"
                                        );
                                    },
                                    props: {},
                                    sort_order: 20,
                                    id: "required_product_key_attribute_group"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "price" },
                                        "Price"
                                    ),
                                    props: {},
                                    sort_order: 30,
                                    id: "required_product_key_price"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "sku" },
                                        "Sku"
                                    ),
                                    props: {},
                                    sort_order: 40,
                                    id: "required_product_key_sku"
                                }]
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Area, {
                                id: "coupon_required_product_operator_list",
                                reactcomponent: "select",
                                wrapperProps: {
                                    name: `condition[required_product][${i}][operator]`,
                                    className: 'uk-select uk-form-small uk-form-width-small',
                                    value: p.operator,
                                    onChange: e => updateProduct(e, 'operator', i)
                                },
                                coreWidgets: [{
                                    component: () => React.createElement(
                                        "option",
                                        { value: "=" },
                                        "Equal"
                                    ),
                                    props: {},
                                    sort_order: 10,
                                    id: "coupon_required_product_operator_equal"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "<>" },
                                        "Not equal"
                                    ),
                                    props: {},
                                    sort_order: 10,
                                    id: "coupon_required_product_operator_equal"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: ">" },
                                        "Greater"
                                    ),
                                    props: {},
                                    sort_order: 20,
                                    id: "coupon_required_product_operator_greater"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: ">=" },
                                        "Greater or equal"
                                    ),
                                    props: {},
                                    sort_order: 30,
                                    id: "coupon_required_product_operator_greater_or_equal"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "<" },
                                        "Smaller"
                                    ),
                                    props: {},
                                    sort_order: 40,
                                    id: "coupon_required_product_operator_smaller"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "<=" },
                                        "Equal or smaller"
                                    ),
                                    props: {},
                                    sort_order: 40,
                                    id: "coupon_required_product_operator_equal_or_smaller"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "IN" },
                                        "In"
                                    ),
                                    props: {},
                                    sort_order: 40,
                                    id: "coupon_required_product_operator_in"
                                }, {
                                    component: () => React.createElement(
                                        "option",
                                        { value: "NOT IN" },
                                        "Not in"
                                    ),
                                    props: {},
                                    sort_order: 40,
                                    id: "coupon_required_product_operator_not_in"
                                }]
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, {
                                name: `condition[required_product][${i}][value]`,
                                formId: "coupon-edit-form",
                                value: p.value,
                                validation_rules: ['notEmpty']
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, {
                                name: `condition[required_product][${i}][qty]`,
                                formId: "coupon-edit-form",
                                value: p.qty,
                                validation_rules: ['notEmpty']
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "a",
                                { onClick: e => removeProduct(e, i) },
                                "Remove"
                            )
                        )
                    );
                })
            )
        ),
        React.createElement(
            "a",
            { onClick: e => addProduct(e) },
            "Add condition"
        )
    );
}

function BuyXGetY({ _products }) {
    const [products, setProducts] = React.useState(_products);
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_FIELD_UPDATED, function (message, data) {
            if (data.name === "discount_type" && data.value === "by_x_get_y") {
                setActive(true);
            } else {
                setActive(false);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);
    const addProduct = e => {
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

    return React.createElement(
        "div",
        null,
        active && React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "Buy X get Y"
                )
            ),
            React.createElement(
                "table",
                { className: "uk-table uk-table-small" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Sku"
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "X"
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Y"
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Max of Y"
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Discount percent"
                            )
                        ),
                        React.createElement("th", null)
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    products.map((p, i) => {
                        return React.createElement(
                            "tr",
                            { key: i },
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, {
                                    name: `buyx_gety[${i}][sku]`,
                                    formId: "coupon-edit-form",
                                    value: p.sku,
                                    validation_rules: ['notEmpty']
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, {
                                    name: `buyx_gety[${i}][x]`,
                                    formId: "coupon-edit-form",
                                    value: p.x,
                                    validation_rules: ['notEmpty']
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, {
                                    name: `buyx_gety[${i}][y]`,
                                    formId: "coupon-edit-form",
                                    value: p.y,
                                    validation_rules: ['notEmpty']
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, {
                                    name: `buyx_gety[${i}][max_y]`,
                                    formId: "coupon-edit-form",
                                    value: p.max_y,
                                    validation_rules: ['notEmpty']
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, {
                                    name: `buyx_gety[${i}][discount]`,
                                    formId: "coupon-edit-form",
                                    value: p.discount,
                                    validation_rules: ['notEmpty']
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "a",
                                    { onClick: e => removeProduct(e, i) },
                                    "Remove"
                                )
                            )
                        );
                    })
                )
            ),
            React.createElement(
                "a",
                { onClick: e => addProduct(e) },
                "Add product"
            )
        )
    );
}

function OrderCondition(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-2 uk-margin-medium-top" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "Order condition"
                )
            ),
            React.createElement(Text, {
                name: "condition[order_total]",
                label: "Minimum purchase amount",
                value: props.order_total ? props.order_total : ''
            }),
            React.createElement(Text, {
                name: "condition[order_qty]",
                label: "Minimum purchase qty",
                value: props.order_qty ? props.order_qty : ''
            }),
            React.createElement(RequiredProducts, { requiredProducts: props.required_product ? props.required_product : [] })
        )
    );
}

function CustomerCondition(props) {
    const customerGroups = ReactRedux.useSelector(state => _.get(state, 'appState.customerGroups'));
    return React.createElement(
        "div",
        { className: "uk-width-1-2 uk-margin-medium-top" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "Customer condition"
                )
            ),
            React.createElement(Area, {
                id: "coupon_customer_condition",
                coreWidgets: [{
                    component: Select,
                    props: {
                        name: "user_condition[group]",
                        label: "Customer group",
                        value: props.group ? props.group : 999,
                        options: customerGroups
                    },
                    sort_order: 10,
                    id: "coupon_customer_condition_group"
                }, {
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
                }, {
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
                }]
            })
        )
    );
}

function TargetProduct({ products, discount_type }) {
    const [active, setActive] = React.useState(() => {
        if (discount_type === "fixed_discount_to_specific_products" || discount_type === "percentage_discount_to_specific_products") {
            return true;
        } else {
            return false;
        }
    });

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_FIELD_UPDATED, function (message, data) {
            if (data.name === "discount_type" && (data.value === "fixed_discount_to_specific_products" || data.value === "percentage_discount_to_specific_products")) {
                setActive(true);
            } else {
                setActive(false);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    return React.createElement(
        "div",
        null,
        active === true && React.createElement(
            "div",
            null,
            React.createElement(Text, {
                name: "target_products",
                value: products,
                validation_rules: ['notEmpty'],
                formId: "coupon-edit-form",
                label: "Target products",
                comment: "Use comma to separate in case multiple products"
            })
        )
    );
}

export default function CouponForm(props) {
    const condition = props.condition ? JSON.parse(props.condition) : {};
    const user_condition = props.user_condition ? JSON.parse(props.user_condition) : {};
    const buyx_gety = props.buyx_gety ? JSON.parse(props.buyx_gety) : [];
    return React.createElement(
        "div",
        { className: "uk-grid uk-grid-small uk-child-width-expand@s" },
        React.createElement(
            Form,
            _extends({ id: "coupon-edit-form" }, props),
            React.createElement(Area, {
                id: "coupon-general",
                className: "uk-grid uk-grid-small",
                coreWidgets: [{
                    component: General,
                    props: props,
                    sort_order: 10,
                    id: "coupon-general"
                }, {
                    component: OrderCondition,
                    props: condition,
                    sort_order: 20,
                    id: "coupon-order-condition"
                }, {
                    component: CustomerCondition,
                    props: user_condition,
                    sort_order: 25,
                    id: "coupon-customer-condition"
                }, {
                    component: TargetProduct,
                    props: { products: props.target_products ? props.target_products : "", "discount_type": props.discount_type },
                    sort_order: 30,
                    id: "coupon-order-target-products"
                }, {
                    component: BuyXGetY,
                    props: { _products: buyx_gety },
                    sort_order: 30,
                    id: "coupon-order-buyx_gety"
                }]
            })
        )
    );
}