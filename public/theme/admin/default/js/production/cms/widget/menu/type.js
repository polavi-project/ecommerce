export default function MenuWidgetType({ areaProps }) {
    if (areaProps.noOuter === true) return React.createElement(
        'option',
        { value: 'menu' },
        'Menu'
    );else if (areaProps.selectedType == 'menu') return React.createElement(
        'span',
        null,
        'Menu'
    );else return null;
}