export default function FlatRateName({ areaProps, title }) {
    if (_.get(areaProps, 'shipping_method') !== 'flatrate') return null;else return React.createElement(
        'td',
        null,
        React.createElement(
            'span',
            null,
            title
        )
    );
}