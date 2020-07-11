import Text from "../../../../../../../../js/production/form/fields/text.js";
import MultiSelect from "../../../../../../../../js/production/form/fields/multiselect.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import {FORM_VALIDATED} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function isDuplicated(attrs1, attrs2) {
    let flag = true;
    attrs1.forEach((a1) => {
        let a2 = attrs2.find((a) => a.attribute_code == a1.attribute_code);
        if(!a2 || (parseInt(a2.option_id) !== parseInt(a1.option_id)))
            flag = false;
    });

    return flag;
}

function Thumbnail({variant}) {
    const uploadApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const [file, setFile] = React.useState({url: _.get(variant, "image.url", null), path: _.get(variant, "image.path", null)});
    const fileInput = React.useRef(null);
    const onChange = (e) => {
        e.persist();
        let formData = new FormData();
        formData.append('files', e.target.files[0]);
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "${'catalog/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000) + '/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000)}") {files {status message file {url path}}}}`);

        Fetch(
            uploadApi,
            false,
            "POST",
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.uploadMedia.files')) {
                    let files = [];
                    _.get(response, 'payload.data.uploadMedia.files').forEach((e,i) => {
                        files.push(e.file);
                    });
                    setFile({...files[0]});
                }
            },
            null,
            () => {
                e.target.value = null;
            }
        );
    };
    return <div className="variant-thumbnail">
        {file.url && <div>
            <img src={file.url}/>
            <input type={"hidden"} value={file.path} name={`variant_group[variants][${variant.variant_product_id}][image]`}/>
        </div>}
        {!file.url && <div>
            <label htmlFor={"variant-thumbnail-upload-" + variant.variant_product_id}><a href="javascript:void(0)" onClick={(e) => {e.preventDefault(); fileInput.current.click();}}><i className="fas fa-camera"></i></a></label>
            <input ref={fileInput} id={"variant-thumbnail-upload-" + variant.variant_product_id} type="file" onChange={onChange} style={{display:"none"}}/>
        </div>}
    </div>
}

function Variant({attributes, variant, removeVariant, updateVariant}) {
    const graphqlApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const onUnlink = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('query', `mutation UnlinkVariant { unlinkVariant (productId: ${variant.variant_product_id}) {status}}`);

        Fetch(
            graphqlApi,
            false,
            "POST",
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.unlinkVariant.status') === true) {
                    removeVariant(variant);
                }
            }
        );
    };
    return <tr className={variant.duplicate === true ? "duplicated" : ""}>
        <td className="variant-image">
            <Thumbnail variant={variant}/>
        </td>
        {attributes.map((a, i) => {
            return <td key={a.attribute_id}>
                {variant.current !== true && <Select
                    name={`variant_group[variants][${variant.variant_product_id}][attributes][${a.attribute_id}]`}
                    formId="product-edit-form"
                    validation_rules={['notEmpty']}
                    value={_.get(_.get(variant, "attributes", []).find((e) => e.attribute_code === a.attribute_code), "option_id", "")}
                    options={(()=> {
                        return a.options.map((o,i)=> { return {value: parseInt(o.option_id), text: o.option_text}})
                    })()}
                    handler={(e) => {
                        updateVariant(
                            variant.variant_product_id,
                            {...variant, attributes: attributes.map((at) => {
                                    let attr = variant.attributes.find((ax) => ax.attribute_code === at.attribute_code) ? variant.attributes.find((ax) => ax.attribute_code === at.attribute_code) : {attribute_code: at.attribute_code, attribute_id: at.attribute_id};
                                    if(at.attribute_code === a.attribute_code) {
                                        attr.option_id = e.target.value;
                                        attr.value_text = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
                                    }
                                    return attr;
                                })}
                        );
                    }}
                />}
                {variant.current === true && <div>
                    <Text
                        name={`variant_group[variants][${variant.variant_product_id}][attributes][text]`}
                        formId="product-edit-form"
                        validation_rules={['notEmpty']}
                        value={_.get(_.get(variant, "attributes", []).find((e) => e.attribute_code === a.attribute_code), "value_text", "")}
                        readOnly={true}
                    />
                    <input
                        name={`variant_group[variants][${variant.variant_product_id}][attributes][${a.attribute_id}]`}
                        type="hidden"
                        value={_.get(_.get(variant, "attributes", []).find((e) => e.attribute_code === a.attribute_code), "option_id", "")}
                        readOnly={true}
                    />
                </div>}
            </td>
        })}
        <td>
            {variant.editUrl && <Text
                name={`variant_group[variants][${variant.variant_product_id}][sku]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.sku}
                readOnly={true}
            />}
            {!variant.editUrl && <Text
                name={`variant_group[variants][${variant.variant_product_id}][sku]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.sku}
                readOnly={variant.current === true}
            />}
        </td>
        <td>
            <Text
                name={`variant_group[variants][${variant.variant_product_id}][price]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.price}
                readOnly={variant.current === true}
            />
        </td>
        <td>
            <Text
                name={`variant_group[variants][${variant.variant_product_id}][qty]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.qty}
                handler={(e) => {

                }}
                readOnly={variant.current === true}
            />
        </td>
        <td>
            <Switch
                name={`variant_group[variants][${variant.variant_product_id}][status]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.status}
                disabled={variant.current === true}
            />
        </td>
        <td>
            <Switch
                name={`variant_group[variants][${variant.variant_product_id}][visibility]`}
                formId="product-edit-form"
                validation_rules={['notEmpty']}
                value={variant.visibility}
            />
        </td>
        <td>
            {variant.current !== true && <div><a href="#" className="text-danger" onClick={(e) => {e.preventDefault(); onUnlink(e)}}>Unlink</a></div>}
            <div>{(variant.editUrl && variant.current !== true) && <a href={variant.editUrl} target="_blank">Edit</a>}</div>
        </td>
    </tr>
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

    const search = (e) => {
        e.persist();
        if(typeTimeout) clearTimeout(typeTimeout);
        setTypeTimeout(setTimeout(() => {
            let formData = new FormData();
            formData.append('query', `{potentialVariants (attributeGroupId : ${attributeGroup.attribute_group_id} name: "${e.target.value}") { name image { url: image path} sku qty price status attributes { attribute_id attribute_code option_id value_text: attribute_value_text} editUrl }}`);

            Fetch(
                graphqlApi,
                false,
                "POST",
                formData,
                null,
                (response) => {
                    if(_.get(response, 'payload.success') === true) {
                        setPotentialVariants(_.get(response, 'payload.data.potentialVariants'));
                    }
                }
            );
        }, 1500));
    };

    const validate = (formId, errors) => {
        setVariants(variants.map((v) => {
            v.duplicate = false;
            variants.forEach((variant) => {
                if(v.variant_product_id != variant.variant_product_id && isDuplicated(v.attributes, variant.attributes)) {
                    v.duplicate = true;
                    errors['variants'] = "Duplicated variant";
                }
            });

            return v;
        }))
    };

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_VALIDATED, function(message, data) {
            validate(data.formId, data.errors);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, [variants]);

    React.useEffect(() => {
        setVariants(variants.map((v) => {
            if(v.current === true) {
                let attributes = [];
                props.attributes.forEach((a)=> {
                    attributes.push({
                        attribute_code: a.attribute_code,
                        attribute_id: a.attribute_id,
                        option_id: parseInt(attributeGroup.attributes.find((e) => e.attribute_code === a.attribute_code)["selected_option"]),
                        value_text: attributeGroup.attributes.find((e) => e.attribute_code === a.attribute_code)["value_text"]
                    });
                });
                v.attributes = attributes;
            }

            return v;
        }));
    }, [attributeGroup]);

    React.useEffect(() => {
        setVariants(variants.map((v) => {
            if(v.current === true) {
                v['sku'] = currentSku;
            }

            return v;
        }))
    }, [currentSku]);

    React.useEffect(() => {
        setVariants(variants.map((v) => {
            if(v.current === true) {
                v['price'] = currentPrice;
            }

            return v;
        }))
    }, [currentPrice]);

    React.useEffect(() => {
        setVariants(variants.map((v) => {
            if(v.current === true) {
                v['qty'] = currentQty;
            }

            return v;
        }))
    }, [currentQty]);

    const addVariant = (e, variant = null) => {
        e.preventDefault();
        if(variant === null)
            setVariants(variants.concat({
                variant_product_id: Date.now(),
                attributes: [],
                image: {},
                sku: "",
                price: 0,
                qty: "",
                status: 1,
                visibility: 0,
                isNew: true
            }));
        else
            setVariants(variants.concat(variant));
    };

    const removeVariant = (variant) => {
        setVariants(variants.filter((v) => parseInt(v.variant_product_id) !== parseInt(variant.variant_product_id)));
    };

    const updateVariant = (id, value) => {
        setVariants(variants.map((v) => {
            if(parseInt(v.variant_product_id) === parseInt(id))
                return value;
            return v;
        }))
    };

    return <div>
        <input type="hidden" value={props.variant_group_id} name="variant_group[variant_group_id]"/>
        {props.attributes.map((a) => {
            return <input type="hidden" value={a.attribute_id} name="variant_group[variant_group_attributes][]"/>
        })}
        <div className="mb-4">{props.attributes.map((a) => <span className="badge badge-primary">{a.attribute_name} </span>)}</div>
        <table className="table-bordered table">
            <thead>
            <td><span>Image</span></td>
            {props.attributes.map((a, i) => {
                return <td key={i}><span>{a.attribute_name}</span></td>
            })}
            <td><span>SKU</span></td>
            <td><span>Price</span></td>
            <td><span>Qty</span></td>
            <td><span>Status</span></td>
            <td><span>Visibility</span></td>
            <td><span>Action</span></td>
            </thead>
            <tbody>
            {variants.map((v) => {
                return <Variant
                    key={v.variant_product_id}
                    variant={v}
                    attributes={props.attributes}
                    removeVariant={removeVariant}
                    updateVariant={updateVariant}
                />
            })}
            </tbody>
        </table>
        <div className="sml-flex-space-between">
            <div><a href="#" onClick={(e) => addVariant(e)}><i className="fas fa-plus"></i><span className="pl-1">Add a new variant</span></a></div>
            <div>
                <div className="autocomplete-search">
                    <input ref={searchInput} type="text" className="form-control search-input" placeholder="Search for variant" onChange={(e) => search(e)}/>
                    <a className="search-clear" href={"#"} onClick={(e) => {e.preventDefault(); setPotentialVariants([]); searchInput.current.value = null;}}><i className="fas fa-times"></i></a>
                    {potentialVariants.length > 0 && <div className="search-result">
                        <table className="table table-bordered">
                            {potentialVariants.map((v) => {
                                return <tr>
                                    <td>{v.image.url && <img src={v.image.url}/>}</td>
                                    <td><span>{v.name}</span></td>
                                    <td><span>{v.sku}</span></td>
                                    <td><span>{v.price}</span></td>
                                    <td><a href="#" onClick={(e) => {
                                        addVariant(e, {
                                            variant_product_id: Date.now(),
                                            attributes: v.attributes.filter((a) => props.attributes.find((e) => e.attribute_code === a.attribute_code) !== undefined),
                                            image: v.image,
                                            sku: v.sku,
                                            price: v.price,
                                            qty: v.qty,
                                            status: v.status,
                                            visibility: 0,
                                            editUrl: v.editUrl
                                        })
                                    }}><i className="fas fa-plus"></i></a></td>
                                </tr>
                            })}
                        </table>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

function CreateVariantGroup() {
    const attributeGroup = ReactRedux.useSelector(state => _.get(state, 'appState.attributeGroup'));
    const [attributes, setAttributes] = React.useState([]);
    const [creating, setCreating] = React.useState(false);

    const onCreate = (e) => {
        e.preventDefault();
        setCreating(true);
    };

    const variableAttributes = attributeGroup === undefined ? [] : attributeGroup.attributes.filter((a) => a.type === "select");
    return <div>
        {creating === true && <Variants
            id={null}
            variants={[{
                variant_product_id: Date.now(),
                attributes: [],
                image: {},
                sku: "",
                price: 0,
                qty: "",
                status: 1,
                visibility: 1,
                current: true
            }]}
            attributes={attributeGroup.attributes.filter((a) => attributes.includes(a.attribute_id) || attributes.includes(parseInt(a.attribute_id)))}
        />}
        {creating === false && <div>
            {variableAttributes.length >0 && <div>
                <MultiSelect
                    name={'variant_group_attributes[]'}
                    label={'Variant attributes'}
                    formId="product-edit-form"
                    value={undefined}
                    options={(()=> {
                        return attributeGroup.attributes.map((a,i)=> { return {value: a.attribute_id, text: a.attribute_name}})
                    })()}
                    validation_rules={['notEmpty']}
                    handler={(e) => {
                        let val = [...e.target.options].filter(o => o.selected).map(o => o.value);
                        setAttributes(val);
                    }}
                />
                <div className="sml-flex">
                    <button className="btn btn-primary" onClick={(e) => onCreate(e)}>Create</button>
                </div>
            </div>}
            {variableAttributes.length === 0 && <div className="alert alert-danger" role="alert">
                There is no "Select" attribute available in {attributeGroup == undefined ? "" : attributeGroup.group_name} product type.
            </div>}
        </div>}
    </div>
}

function Edit(props) {
    const attributeGroup = ReactRedux.useSelector(state => _.get(state, 'appState.attributeGroup', {attributes: []}));
    return <Variants
        {...props}
        attributes={attributeGroup.attributes.filter((a) => props.attributes.includes(a.attribute_id) || props.attributes.includes(parseInt(a.attribute_id)))}
    />
}

function New() {
    const [action, setAction] = React.useState(undefined);
    return <div>
        {action === undefined && <div>
            <div className="text-center">
                <div className="mb-4">This product has some variants like color or size?</div>
                <a className="btn btn-primary" href="javascript:void(0);" onClick={() => setAction("create")}>Create a variant group</a>
            </div>
        </div>}
        {action === "create" && <div>
            <CreateVariantGroup/>
            <button className="btn-danger btn">Cancel</button>
        </div>}
    </div>
}

export default function VariantGroup(props) {
    const [id, setId] = React.useState(props.variant_group_id);
    return <div className="sml-block mt-4 variants-block">
        <div className="sml-block-title"><span>Variant</span></div>
        {!props.variant_group_id && <New/>}
        {id && <Edit {...props}/>}
    </div>
}