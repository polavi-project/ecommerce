export default function CodName({ areaProps }) {
    if (_.get(areaProps, 'payment_method') !== 'cod') return null;else return React.createElement(
        'td',
        null,
        React.createElement(
            'span',
            null,
            'Cash on delivery'
        )
    );
}