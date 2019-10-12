import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";

export default function CustomOption(props) {
    const [options, setOptions] = React.useState(props.options);

    const addOption = (e) => {
        e.preventDefault();
        setOptions(options.concat({
            option_id: Date.now(),
            option_name: "",
            option_type: "",
            is_required: "",
            sort_order: ""
        }));
    };

    const removeOption = (key, e) => {
        e.preventDefault();
        const newOptions = options.filter((_, index) => index !== key);
        setOptions(newOptions);
    };

    const addCustomOptionValue = (option_id, e) => {
        e.preventDefault();
        setOptions(options.map((o, i)=> {
            if(parseInt(o.option_id) === parseInt(option_id)) {
                let values = o.values === undefined ? [] : o.values;
                values.push({
                    value_id: Date.now(),
                    option_id: option_id,
                    extra_price: "",
                    sort_order: "",
                    value: ""
                });
                o.values = values;
            }
            return o;
        }))
    };

    const removeCustomOptionValue = (option_id, value_id, e) => {
        e.preventDefault();
        setOptions(options.map((o, i)=> {
            if(parseInt(o.option_id) === parseInt(option_id)) {
                let values = o.values === undefined ? [] : o.values;
                o.values = values.filter((v, i) => parseInt(v.value_id) !== parseInt(value_id));
            }
            return o;
        }))
    };

    return <div>
        <div className="group-form-title">Custom Options</div>
        <ul>
            {options.map((option, index) => {
                let values = option['values'] === undefined ? [] : option['values'];
                let {option_id, option_name, sort_order, option_type, is_required} = option;
                return <li key={index}>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>Option name</td>
                            <td>Type</td>
                            <td>Is required?</td>
                            <td>Sort order</td>
                            <td><a href="#" onClick={(e) => removeOption(index, e)}><span uk-icon="minus-circle"></span></a></td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <Text formId="product-edit-form" name={'options[' + option_id + '][option_name]'} value={option_name} validation_rules={['notEmpty']}/>
                            </td>
                            <td>
                                <Select
                                    name={'options[' + option_id + '][option_type]'}
                                    value={option_type}
                                    options={[
                                        {value: 'select', text: 'Single choice'},
                                        {value: 'multiselect', text: 'Multiple choice'},
                                        {value: 'freetext', text: 'Free text'}
                                    ]}
                                />
                            </td>
                            <td>
                                <Select
                                    name={'options[' + option_id + '][is_required]'}
                                    value={is_required}
                                    options={[
                                        {value: '1', text: 'Yes'},
                                        {value: '0', text: 'No'}
                                    ]}
                                />
                            </td>
                            <td>
                                <Text name={'options[' + option_id + '][sort_order]'} value={sort_order}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table>
                        <thead>
                        <tr>
                            <td>Value</td>
                            <td>Extra Price</td>
                            <td>Sort Order</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {values.map((val, i) => {
                            let {value_id, option_id, extra_price, sort_order, value } = val;
                            return <tr key={val.value_id}>
                                <td>
                                    <Text
                                        formId="product-edit-form"
                                        name={'options[' + option_id + '][values][' + value_id + '][value]'}
                                        value={value}
                                        validation_rules={['notEmpty']}
                                    />
                                </td>
                                <td>
                                    <Text name={'options[' + option_id + '][values][' + value_id + '][extra_price]'} value={extra_price}/>
                                </td>
                                <td>
                                    <Text name={'options[' + option_id + '][values][' + value_id + '][sort_order]'} value={sort_order}/>
                                </td>
                                <td colSpan="3"><a href="#" onClick={(e) => removeCustomOptionValue(option_id, value_id, e)}><span uk-icon="minus-circle"></span></a></td>
                            </tr>
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="3"><a href="#" onClick={(e) => addCustomOptionValue(option_id, e)}><span uk-icon="plus-circle"></span></a></td>
                        </tr>
                        </tfoot>
                    </table>
                </li>;
            })}
        </ul>
        <div><a href="#" onClick={(e) => addOption(e)}><span uk-icon="plus-circle"></span></a></div>
    </div>;
}