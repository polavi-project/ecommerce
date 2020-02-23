export default function ProductFilterWidgetType({ areaProps }) {
    if (areaProps.noOuter === true) return React.createElement(
        'option',
        { value: 'product_filter' },
        'Product filter'
    );else if (areaProps.selectedType == 'product_filter') return React.createElement(
        'span',
        null,
        'Product filter'
    );else return null;
}