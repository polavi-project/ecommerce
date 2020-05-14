export default function Pagination({ total, currentFilters, setFilter }) {
    const limit = _.get(currentFilters.find(e => e.key == 'limit'), 'value', 20);
    const current = _.get(currentFilters.find(e => e.key == 'page'), 'value', 1);
    const [inputVal, setInPutVal] = React.useState(current);

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);

    const onKeyPress = e => {
        if (e.which !== 13) return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if (page < 1) page = 1;
        if (page > Math.ceil(total / limit)) page = Math.ceil(total / limit);
        setFilter('page', '=', page);
    };

    const onPrev = e => {
        e.preventDefault();
        let prev = current - 1;
        if (current === 1) return;
        setFilter('page', '=', prev);
    };

    const onNext = e => {
        e.preventDefault();
        let next = current + 1;
        if (current * limit >= total) return;
        setFilter('page', '=', next);
    };

    const onFirst = e => {
        e.preventDefault();
        if (current === 1) return;
        setFilter('page', '=', 1);
    };

    const onLast = e => {
        e.preventDefault();
        if (current === Math.ceil(total / limit)) return;
        setFilter('page', '=', Math.ceil(total / limit));
    };

    return React.createElement(
        'div',
        { className: 'grid-pagination-container' },
        React.createElement(
            'table',
            { className: 'grid-pagination mb-4' },
            React.createElement(
                'tr',
                null,
                current > 1 && React.createElement(
                    'td',
                    { className: 'prev' },
                    React.createElement(
                        'a',
                        { href: "#", onClick: e => onPrev(e) },
                        React.createElement('i', { className: 'far fa-caret-square-left' })
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'first' },
                    React.createElement(
                        'a',
                        { href: '#', onClick: e => onFirst(e) },
                        '1'
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'current' },
                    React.createElement('input', { className: 'form-control', value: inputVal, onChange: e => setInPutVal(e.target.value), type: 'text', onKeyPress: e => onKeyPress(e) })
                ),
                React.createElement(
                    'td',
                    { className: 'last' },
                    React.createElement(
                        'a',
                        { href: '#', onClick: e => onLast(e) },
                        Math.ceil(total / limit)
                    )
                ),
                current * limit < total && React.createElement(
                    'td',
                    { className: 'next' },
                    React.createElement(
                        'a',
                        { href: "#", onClick: e => onNext(e) },
                        React.createElement('i', { className: 'far fa-caret-square-right' })
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'total' },
                    React.createElement(
                        'span',
                        null,
                        total,
                        ' records'
                    )
                )
            )
        )
    );
}