import { Fetch } from "../../../../../../../../js/production/fetch.js";

function getOptions(attributeCode, variants) {
    let options = [];
    variants.forEach(v => {
        let option = v.attributes.find(a => a.attribute_code === attributeCode);
        if (!options.find(o => parseInt(o.option_id) === parseInt(option.option_id))) options.push(option);
    });

    return options;
}

function isSelected(attributeCode, optionId, currentFilters = {}) {
    return currentFilters[attributeCode] !== undefined && parseInt(currentFilters[attributeCode]) === parseInt(optionId);
}

function isAvailable(attributeCode, optionId, variants, currentFilters = {}) {
    let availableVars = [];
    if (Object.keys(currentFilters).length === 0) availableVars = variants;else variants.forEach(v => {
        let vAttrs = v.attributes;
        let flag = true;
        for (let attr of Object.keys(currentFilters)) {
            let option = vAttrs.find(a => a.attribute_code === attr);
            if (attr !== attributeCode && parseInt(option.option_id) !== parseInt(currentFilters[attr])) flag = false;
        }
        if (flag === true) availableVars.push(v);
    });
    console.log(availableVars, attributeCode);
    return availableVars.find(a => {
        return a.attributes.find(at => {
            return at.attribute_code === attributeCode && parseInt(at.option_id) === parseInt(optionId);
        }) !== undefined;
    });
}

export default function Variants({ attributes, variants }) {
    console.log(variants);
    const variantFilters = ReactRedux.useSelector(state => _.get(state, 'appState.variantFilters', {}));
    const currentProductUrl = ReactRedux.useSelector(state => _.get(state, 'appState.currentUrl'));

    const onSelect = (e, attribute_code, option_id) => {
        e.preventDefault();
        let url = new URL(currentProductUrl);

        if (Object.keys(variantFilters).length > 0) {
            for (let attr of Object.keys(variantFilters)) {
                url.searchParams.set(attr, variantFilters[attr]);
            }
        }

        url.searchParams.set(attribute_code, option_id);
        Fetch(url, true);
    };

    return React.createElement(
        'div',
        { className: 'variant variant-container' },
        attributes.map(a => {
            let options = getOptions(a.attribute_code, variants);
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    null,
                    a.attribute_name
                ),
                React.createElement(
                    'ul',
                    { className: 'variant-option-list' },
                    options.map(o => {
                        let className = "";
                        if (isSelected(a.attribute_code, o.option_id, variantFilters)) className = "selected";
                        if (isAvailable(a.attribute_code, o.option_id, variants, variantFilters)) return React.createElement(
                            'li',
                            { className: className },
                            React.createElement(
                                'a',
                                { href: "#", onClick: e => onSelect(e, a.attribute_code, o.option_id) },
                                o.value_text
                            )
                        );else return React.createElement(
                            'li',
                            { className: className },
                            React.createElement(
                                'span',
                                { className: 'un-available' },
                                o.value_text
                            )
                        );
                    })
                )
            );
        })
    );
}