export default function Pagination({ total, currentFilters, setFilter }) {
    const currentLimit = _.get(currentFilters.find(e => e.key == 'limit'), 'value', 20);
    const [limit, setLimit] = React.useState(_.get(currentFilters.find(e => e.key == 'limit'), 'value', 20));
    const current = _.get(currentFilters.find(e => e.key == 'page'), 'value', 1);
    const [inputVal, setInPutVal] = React.useState(current);

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);

    React.useEffect(() => {
        setLimit(currentLimit);
    }, [currentLimit]);

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

    const onChangeLimit = e => {
        e.preventDefault();
        let limit = parseInt(e.target.value);
        if (limit < 1) return;
        setLimit(limit);
    };

    const onKeyPressLimit = e => {
        if (e.which !== 13) return;
        e.preventDefault();
        let limit = parseInt(e.target.value);
        if (limit < 1) return;
        setFilter('limit', '=', limit);
    };

    return React.createElement(
        'div',
        { className: 'grid-pagination-container' },
        React.createElement(
            'table',
            { className: 'grid-pagination' },
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'span',
                        null,
                        'Show'
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'limit' },
                    React.createElement(
                        'div',
                        { className: 'flex-column-reverse sml-flex' },
                        React.createElement('input', { className: 'form-control', value: limit, onChange: e => onChangeLimit(e), type: 'text', onKeyPress: e => onKeyPressLimit(e) })
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'per-page' },
                    React.createElement(
                        'span',
                        null,
                        'per page'
                    )
                ),
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