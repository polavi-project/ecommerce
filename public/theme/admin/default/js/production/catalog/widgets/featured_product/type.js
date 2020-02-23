export default function FeaturedProductWidgetType({ areaProps }) {
    if (areaProps.noOuter === true) return React.createElement(
        'option',
        { value: 'featured_products' },
        'Featured products'
    );else if (areaProps.selectedType == 'featured_products') return React.createElement(
        'span',
        null,
        'Featured products'
    );else return null;
}