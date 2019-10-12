const Price = ({ price_excl_tax, price_incl_tax }) => {
    const _price_excl_tax = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price_excl_tax);
    const _price_incl_tax = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price_incl_tax);
    return React.createElement(
        'div',
        { className: 'price-container price-container-both' },
        React.createElement(
            'div',
            { className: 'price-excl-tax' },
            React.createElement(
                'span',
                { className: 'label' },
                'Excl. Tax: '
            ),
            React.createElement(
                'span',
                { className: 'price' },
                _price_excl_tax
            )
        ),
        React.createElement(
            'div',
            { className: 'price-excl-tax' },
            React.createElement(
                'span',
                { className: 'label' },
                'Incl. Tax: '
            ),
            React.createElement(
                'span',
                { className: 'price' },
                _price_incl_tax
            )
        )
    );
};
export default Price;