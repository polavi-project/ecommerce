export default function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('product_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return React.createElement(
        'th',
        { className: "column" },
        React.createElement(
            'div',
            { className: 'header' },
            React.createElement(
                'div',
                { className: "title" },
                React.createElement(
                    'span',
                    null,
                    'Action'
                )
            ),
            React.createElement(
                'a',
                { onClick: () => onClick() },
                'Clean filter'
            )
        )
    );
}