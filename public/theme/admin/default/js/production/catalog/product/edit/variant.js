var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Text from "../../../../../../../../js/production/form/fields/text.js";
import MultiSelect from "../../../../../../../../js/production/form/fields/multiselect.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import { FORM_VALIDATED } from "../../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function isDuplicated(attrs1, attrs2) {
    let flag = true;
    attrs1.forEach(a1 => {
        let a2 = attrs2.find(a => a.attribute_code == a1.attribute_code);
        if (!a2 || parseInt(a2.option_id) !== parseInt(a1.option_id)) flag = false;
    });

    return flag;
}

function Thumbnail({ variant }) {
    const uploadApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const [file, setFile] = React.useState({ url: _.get(variant, "image.url", null), path: _.get(variant, "image.path", null) });
    const fileInput = React.useRef(null);
    const onChange = e => {
        e.persist();
        let formData = new FormData();
        formData.append('files', e.target.files[0]);
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "${'catalog/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000) + '/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000)}") {files {status message file {url path}}}}`);

        Fetch(uploadApi, false, "POST", formData, null, response => {
            if (_.get(response, 'payload.data.uploadMedia.files')) {
                let files = [];
                _.get(response, 'payload.data.uploadMedia.files').forEach((e, i) => {
                    files.push(e.file);
                });
                setFile(_extends({}, files[0]));
            }
        }, null, () => {
            e.target.value = null;
        });
    };
    return React.createElement(
        "div",
        { className: "variant-thumbnail" },
        file.url && React.createElement(
            "div",
            null,
            React.createElement("img", { src: file.url }),
            React.createElement("input", { type: "hidden", value: file.path, name: `variant_group[variants][${variant.variant_product_id}][image]` })
        ),
        !file.url && React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "variant-thumbnail-upload-" + variant.variant_product_id },
                React.createElement(
                    "a",
                    { href: "javascript:void(0)", onClick: e => {
                            e.preventDefault();fileInput.current.click();
                        } },
                    React.createElement("i", { className: "fas fa-camera" })
                )
            ),
            React.createElement("input", { ref: fileInput, id: "variant-thumbnail-upload-" + variant.variant_product_id, type: "file", onChange: onChange, style: { display: "none" } })
        )
    );
}

function Variant({ attributes, variant, removeVariant, updateVariant }) {
    const graphqlApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const onUnlink = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('query', `mutation UnlinkVariant { unlinkVariant (productId: ${variant.variant_product_id}) {status}}`);

        Fetch(graphqlApi, false, "POST", formData, null, response => {
            if (_.get(response, 'payload.data.unlinkVariant.status') === true) {
                removeVariant(variant);
            }
        });
    };
    return React.createElement(
        "tr",
        { className: variant.duplicate === true ? "duplicated" : "" },
        React.createElement(
            "td",
            { className: "variant-image" },
            React.createElement(Thumbnail, { variant: variant })
        ),
        attributes.map((a, i) => {
            return React.createElement(
                "td",
                { key: a.attribute_id },
                variant.current !== true && React.createElement(Select, {
                    name: `variant_group[variants][${variant.variant_product_id}][attributes][${a.attribute_id}]`,
                    formId: "product-edit-form",
                    validation_rules: ['notEmpty'],
                    value: _.get(_.get(variant, "attributes", []).find(e => e.attribute_code === a.attribute_code), "option_id", ""),
                    options: (() => {
                        return a.options.map((o, i) => {
                            return { value: parseInt(o.option_id), text: o.option_text };
                        });
                    })(),
                    handler: e => {
                        updateVariant(variant.variant_product_id, _extends({}, variant, { attributes: attributes.map(at => {
                                let attr = variant.attributes.find(ax => ax.attribute_code === at.attribute_code) ? variant.attributes.find(ax => ax.attribute_code === at.attribute_code) : { attribute_code: at.attribute_code, attribute_id: at.attribute_id };
                                if (at.attribute_code === a.attribute_code) {
                                    attr.option_id = e.target.value;
                                    attr.value_text = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
                                }
                                return attr;
                            }) }));
                    }
                }),
                variant.current === true && React.createElement(
                    "div",
                    null,
                    React.createElement(Text, {
                        name: `variant_group[variants][${variant.variant_product_id}][attributes][text]`,
                        formId: "product-edit-form",
                        validation_rules: ['notEmpty'],
                        value: _.get(_.get(variant, "attributes", []).find(e => e.attribute_code === a.attribute_code), "value_text", ""),
                        readOnly: true
                    }),
                    React.createElement("input", {
                        name: `variant_group[variants][${variant.variant_product_id}][attributes][${a.attribute_id}]`,
                        type: "hidden",
                        value: _.get(_.get(variant, "attributes", []).find(e => e.attribute_code === a.attribute_code), "option_id", ""),
                        readOnly: true
                    })
                )
            );
        }),
        React.createElement(
            "td",
            null,
            variant.editUrl && React.createElement(Text, {
                name: `variant_group[variants][${variant.variant_product_id}][sku]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.sku,
                readOnly: true
            }),
            !variant.editUrl && React.createElement(Text, {
                name: `variant_group[variants][${variant.variant_product_id}][sku]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.sku,
                readOnly: variant.current === true
            })
        ),
        React.createElement(
            "td",
            null,
            React.createElement(Text, {
                name: `variant_group[variants][${variant.variant_product_id}][price]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.price,
                readOnly: variant.current === true
            })
        ),
        React.createElement(
            "td",
            null,
            React.createElement(Text, {
                name: `variant_group[variants][${variant.variant_product_id}][qty]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.qty,
                handler: e => {},
                readOnly: variant.current === true
            })
        ),
        React.createElement(
            "td",
            null,
            React.createElement(Switch, {
                name: `variant_group[variants][${variant.variant_product_id}][status]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.status,
                disabled: variant.current === true
            })
        ),
        React.createElement(
            "td",
            null,
            React.createElement(Switch, {
                name: `variant_group[variants][${variant.variant_product_id}][visibility]`,
                formId: "product-edit-form",
                validation_rules: ['notEmpty'],
                value: variant.visibility
            })
        ),
        React.createElement(
            "td",
            null,
            variant.current !== true && React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { href: "#", className: "text-danger", onClick: e => {
                            e.preventDefault();onUnlink(e);
                        } },
                    "Unlink"
                )
            ),
            React.createElement(
                "div",
                null,
                variant.editUrl && variant.current !== true && React.createElement(
                    "a",
                    { href: variant.editUrl, target: "_blank" },
                    "Edit"
                )
            )
        )
    );
}

function Variants(props) {
    const [variants, setVariants] = React.useState(props.variants ? props.variants : []);
    const [potentialVariants, setPotentialVariants] = React.useState([]);
    const attributeGroup = ReactRedux.useSelector(state => _.get(state, 'appState.attributeGroup'));
    const currentSku = ReactRedux.useSelector(state => _.get(state, 'appState.currentSku'));
    const currentQty = ReactRedux.useSelector(state => _.get(state, 'appState.currentQty'));
    const currentPrice = ReactRedux.useSelector(state => _.get(state, 'appState.currentPrice'));
    const graphqlApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const [typeTimeout, setTypeTimeout] = React.useState(null);
    const searchInput = React.useRef();

    const search = e => {
        e.persist();
        if (typeTimeout) clearTimeout(typeTimeout);
        setTypeTimeout(setTimeout(() => {
            let formData = new FormData();
            formData.append('query', `{potentialVariants (attributeGroupId : ${attributeGroup.attribute_group_id} name: "${e.target.value}") { name image { url: image path} sku qty price status attributes { attribute_id attribute_code option_id value_text: attribute_value_text} editUrl }}`);

            Fetch(graphqlApi, false, "POST", formData, null, response => {
                if (_.get(response, 'payload.success') === true) {
                    setPotentialVariants(_.get(response, 'payload.data.potentialVariants'));
                }
            });
        }, 1500));
    };

    const validate = (formId, errors) => {
        setVariants(variants.map(v => {
            v.duplicate = false;
            variants.forEach(variant => {
                if (v.variant_product_id != variant.variant_product_id && isDuplicated(v.attributes, variant.attributes)) {
                    v.duplicate = true;
                    errors['variants'] = "Duplicated variant";
                }
            });

            return v;
        }));
    };

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_VALIDATED, function (message, data) {
            validate(data.formId, data.errors);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, [variants]);

    React.useEffect(() => {
        setVariants(variants.map(v => {
            if (v.current === true) {
                let attributes = [];
                props.attributes.forEach(a => {
                    attributes.push({
                        attribute_code: a.attribute_code,
                        attribute_id: a.attribute_id,
                        option_id: parseInt(attributeGroup.attributes.find(e => e.attribute_code === a.attribute_code)["selected_option"]),
                        value_text: attributeGroup.attributes.find(e => e.attribute_code === a.attribute_code)["value_text"]
                    });
                });
                v.attributes = attributes;
            }

            return v;
        }));
    }, [attributeGroup]);

    React.useEffect(() => {
        setVariants(variants.map(v => {
            if (v.current === true) {
                v['sku'] = currentSku;
            }

            return v;
        }));
    }, [currentSku]);

    React.useEffect(() => {
        setVariants(variants.map(v => {
            if (v.current === true) {
                v['price'] = currentPrice;
            }

            return v;
        }));
    }, [currentPrice]);

    React.useEffect(() => {
        setVariants(variants.map(v => {
            if (v.current === true) {
                v['qty'] = currentQty;
            }

            return v;
        }));
    }, [currentQty]);

    const addVariant = (e, variant = null) => {
        e.preventDefault();
        if (variant === null) setVariants(variants.concat({
            variant_product_id: Date.now(),
            attributes: [],
            image: {},
            sku: "",
            price: 0,
            qty: "",
            status: 1,
            visibility: 0,
            isNew: true
        }));else setVariants(variants.concat(variant));
    };

    const removeVariant = variant => {
        setVariants(variants.filter(v => parseInt(v.variant_product_id) !== parseInt(variant.variant_product_id)));
    };

    const updateVariant = (id, value) => {
        setVariants(variants.map(v => {
            if (parseInt(v.variant_product_id) === parseInt(id)) return value;
            return v;
        }));
    };

    return React.createElement(
        "div",
        null,
        React.createElement("input", { type: "hidden", value: props.variant_group_id, name: "variant_group[variant_group_id]" }),
        props.attributes.map(a => {
            return React.createElement("input", { type: "hidden", value: a.attribute_id, name: "variant_group[variant_group_attributes][]" });
        }),
        React.createElement(
            "div",
            { className: "mb-4" },
            props.attributes.map(a => React.createElement(
                "span",
                { className: "badge badge-primary" },
                a.attribute_name,
                " "
            ))
        ),
        React.createElement(
            "table",
            { className: "table-bordered table" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Image"
                    )
                ),
                props.attributes.map((a, i) => {
                    return React.createElement(
                        "td",
                        { key: i },
                        React.createElement(
                            "span",
                            null,
                            a.attribute_name
                        )
                    );
                }),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "SKU"
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Price"
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Qty"
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Status"
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Visibility"
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Action"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                variants.map(v => {
                    return React.createElement(Variant, {
                        key: v.variant_product_id,
                        variant: v,
                        attributes: props.attributes,
                        removeVariant: removeVariant,
                        updateVariant: updateVariant
                    });
                })
            )
        ),
        React.createElement(
            "div",
            { className: "sml-flex-space-between" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { href: "#", onClick: e => addVariant(e) },
                    React.createElement("i", { className: "fas fa-plus" }),
                    React.createElement(
                        "span",
                        { className: "pl-1" },
                        "Add a new variant"
                    )
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "autocomplete-search" },
                    React.createElement("input", { ref: searchInput, type: "text", className: "form-control search-input", placeholder: "Search for variant", onChange: e => search(e) }),
                    React.createElement(
                        "a",
                        { className: "search-clear", href: "#", onClick: e => {
                                e.preventDefault();setPotentialVariants([]);searchInput.current.value = null;
                            } },
                        React.createElement("i", { className: "fas fa-times" })
                    ),
                    potentialVariants.length > 0 && React.createElement(
                        "div",
                        { className: "search-result" },
                        React.createElement(
                            "table",
                            { className: "table table-bordered" },
                            potentialVariants.map(v => {
                                return React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        v.image.url && React.createElement("img", { src: v.image.url })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "span",
                                            null,
                                            v.name
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "span",
                                            null,
                                            v.sku
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "span",
                                            null,
                                            v.price
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "#", onClick: e => {
                                                    addVariant(e, {
                                                        variant_product_id: Date.now(),
                                                        attributes: v.attributes.filter(a => props.attributes.find(e => e.attribute_code === a.attribute_code) !== undefined),
                                                        image: v.image,
                                                        sku: v.sku,
                                                        price: v.price,
                                                        qty: v.qty,
                                                        status: v.status,
                                                        visibility: 0,
                                                        editUrl: v.editUrl
                                                    });
                                                } },
                                            React.createElement("i", { className: "fas fa-plus" })
                                        )
                                    )
                                );
                            })
                        )
                    )
                )
            )
        )
    );
}

function CreateVariantGroup() {
    const attributeGroup = ReactRedux.useSelector(state => _.get(state, 'appState.attributeGroup'));
    const [attributes, setAttributes] = React.useState([]);
    const [creating, setCreating] = React.useState(false);

    const onCreate = e => {
        e.preventDefault();
        setCreating(true);
    };

    const variableAttributes = attributeGroup === undefined ? [] : attributeGroup.attributes.filter(a => a.type === "select");
    return React.createElement(
        "div",
        null,
        creating === true && React.createElement(Variants, {
            id: null,
            variants: [{
                variant_product_id: Date.now(),
                attributes: [],
                image: {},
                sku: "",
                price: 0,
                qty: "",
                status: 1,
                visibility: 1,
                current: true
            }],
            attributes: attributeGroup.attributes.filter(a => attributes.includes(a.attribute_id) || attributes.includes(parseInt(a.attribute_id)))
        }),
        creating === false && React.createElement(
            "div",
            null,
            variableAttributes.length > 0 && React.createElement(
                "div",
                null,
                React.createElement(MultiSelect, {
                    name: 'variant_group_attributes[]',
                    label: 'Variant attributes',
                    formId: "product-edit-form",
                    value: undefined,
                    options: (() => {
                        return attributeGroup.attributes.map((a, i) => {
                            return { value: a.attribute_id, text: a.attribute_name };
                        });
                    })(),
                    validation_rules: ['notEmpty'],
                    handler: e => {
                        let val = [...e.target.options].filter(o => o.selected).map(o => o.value);
                        setAttributes(val);
                    }
                }),
                React.createElement(
                    "div",
                    { className: "sml-flex" },
                    React.createElement(
                        "button",
                        { className: "btn btn-primary", onClick: e => onCreate(e) },
                        "Create"
                    )
                )
            ),
            variableAttributes.length === 0 && React.createElement(
                "div",
                { className: "alert alert-danger", role: "alert" },
                "There is no \"Select\" attribute available in ",
                attributeGroup == undefined ? "" : attributeGroup.group_name,
                " product type."
            )
        )
    );
}

function Edit(props) {
    const attributeGroup = ReactRedux.useSelector(state => _.get(state, 'appState.attributeGroup', { attributes: [] }));
    return React.createElement(Variants, _extends({}, props, {
        attributes: attributeGroup.attributes.filter(a => props.attributes.includes(a.attribute_id) || props.attributes.includes(parseInt(a.attribute_id)))
    }));
}

function New() {
    const [action, setAction] = React.useState(undefined);
    return React.createElement(
        "div",
        null,
        action === undefined && React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "text-center" },
                React.createElement(
                    "div",
                    { className: "mb-4" },
                    "This product has some variants like color or size?"
                ),
                React.createElement(
                    "a",
                    { className: "btn btn-primary", href: "javascript:void(0);", onClick: () => setAction("create") },
                    "Create a variant group"
                )
            )
        ),
        action === "create" && React.createElement(
            "div",
            null,
            React.createElement(CreateVariantGroup, null),
            React.createElement(
                "button",
                { className: "btn-danger btn" },
                "Cancel"
            )
        )
    );
}

export default function VariantGroup(props) {
    const [id, setId] = React.useState(props.variant_group_id);
    return React.createElement(
        "div",
        { className: "sml-block mt-4 variants-block" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            React.createElement(
                "span",
                null,
                "Variant"
            )
        ),
        !props.variant_group_id && React.createElement(New, null),
        id && React.createElement(Edit, props)
    );
}