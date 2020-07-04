import {Fetch} from "../../../../../../../../js/production/fetch.js";
import {FORM_VALIDATED} from "../../../../../../../../js/production/event-types.js";

function getOptions(attributeCode, variants) {
    let options = [];
    variants.forEach((v) => {
        let option = v.attributes.find((a) => a.attribute_code === attributeCode);
        if(!options.find((o) => parseInt(o.option_id) === parseInt(option.option_id)))
            options.push(option);
    });

    return options;
}

function isSelected(attributeCode, optionId, currentFilters = {}) {
    return (currentFilters[attributeCode] !== undefined && parseInt(currentFilters[attributeCode]) === parseInt(optionId));
}

function isAvailable(attributeCode, optionId, variants, currentFilters = {}) {
    let availableVars = [];
    if(Object.keys(currentFilters).length === 0)
        availableVars = variants;
    else
        variants.forEach((v) => {
            let vAttrs = v.attributes;
            let flag = true;
            for (let attr of Object.keys(currentFilters)) {
                let option = vAttrs.find((a) => a.attribute_code === attr);
                if(attr !== attributeCode && parseInt(option.option_id) !== parseInt(currentFilters[attr]))
                    flag = false;
            }
            if(flag === true)
                availableVars.push(v);
        });
    return availableVars.find((a) => {
        return a.attributes.find((at) => { return at.attribute_code === attributeCode && parseInt(at.option_id) === parseInt(optionId) }) !== undefined
    })
}

export default function Variants({attributes, variants}) {
    const [error, setError] = React.useState(null);
    const variantFilters = ReactRedux.useSelector(state => _.get(state, 'appState.variantFilters', {}));
    const currentProductUrl = ReactRedux.useSelector(state => _.get(state, 'appState.currentUrl'));

    const validate = (formId, errors) => {
        if(formId !== "product-form")
            return true;

        let flag = true;
        attributes.forEach((a) => {
            if(variantFilters[a.attribute_code] === undefined)
                flag = false;
        });
        if(flag === false) {
            errors["variants"] = "Missing variant";
            setError("Please select variant option");
        }
    };

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_VALIDATED, function(message, data) {
            validate(data.formId, data.errors);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    const onSelect = (e, attribute_code, option_id) => {
        e.preventDefault();
        let url = new URL(currentProductUrl);

        if(Object.keys(variantFilters).length > 0) {
            for (let attr of Object.keys(variantFilters)) {
                url.searchParams.set(attr, variantFilters[attr]);
            }
        }

        url.searchParams.set(attribute_code, option_id);
        Fetch(url, true);
    };

    return <div className="variant variant-container">
        {attributes.map((a, i) => {
            let options = getOptions(a.attribute_code, variants);
            return <div>
                <input name={`variant_options[${i}][attribute_id]`} type={"hidden"} value={a.attribute_id}/>
                <input name={`variant_options[${i}][option_id]`} type={"hidden"} value={variantFilters[a.attribute_code] ? variantFilters[a.attribute_code] : ""}/>
                <div>{a.attribute_name}</div>
                <ul className="variant-option-list">
                    {options.map((o) => {
                        let className = "";
                        if(isSelected(a.attribute_code, o.option_id, variantFilters))
                            className = "selected";
                        if(isAvailable(a.attribute_code, o.option_id, variants, variantFilters))
                            return <li className={className}><a href={"#"} onClick={(e) => onSelect(e, a.attribute_code, o.option_id)}>{o.value_text}</a></li>;
                        else
                            return <li className="un-available"><span>{o.value_text}</span></li>;
                    })}
                </ul>
            </div>
        })}
        {error && <div className="variant-validate error text-danger">{error}</div>}
    </div>
}