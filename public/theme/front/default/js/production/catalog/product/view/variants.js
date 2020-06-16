import { Fetch } from "../../../../../../../../js/production/fetch.js";

function getOptions(attributeCode, variants) {
    let options = [];
    variants.forEach(v => {
        let option = v.attributes.find(a => a.attribute_code === attributeCode);
        if (!options.find(o => parseInt(o.option_id) === parseInt(option.option_id))) options.push(option);
    });

    return options;
}

export default function Variants({ attributes, variants }) {
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
        null,
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
                    null,
                    options.map(o => {
                        return React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'a',
                                { href: "#", onClick: e => onSelect(e, a.attribute_code, o.option_id) },
                                React.createElement(
                                    'span',
                                    null,
                                    o.value_text
                                )
                            )
                        );
                    })
                )
            );
        })
    );
}