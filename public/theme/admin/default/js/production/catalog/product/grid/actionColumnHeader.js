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
        { className: "column action-column" },
        React.createElement(
            'div',
            { className: 'table-header' },
            React.createElement(
                'div',
                { className: "title" },
                React.createElement('span', null)
            ),
            React.createElement(
                'div',
                { className: 'filter' },
                React.createElement(
                    'a',
                    { onClick: () => onClick(), className: 'text-danger', title: 'Clear filter', href: 'javascript:void(0)' },
                    React.createElement('i', { className: 'fa fa-filter' }),
                    React.createElement('i', { className: 'fa fa-slash', style: { marginLeft: "-13px" } })
                )
            )
        )
    );
}