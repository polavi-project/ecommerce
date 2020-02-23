export default function TextWidgetType({ areaProps }) {
    if (areaProps.noOuter === true) return React.createElement(
        'option',
        { value: 'text' },
        'Text'
    );else if (areaProps.selectedType == 'text') return React.createElement(
        'span',
        null,
        'Text'
    );else return null;
}