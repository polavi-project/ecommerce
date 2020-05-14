export default function Pagination({ total, currentFilters, setFilter }) {
    const limit = _.get(currentFilters.find(e => e.key == 'limit'), 'value', 20);
    const current = _.get(currentFilters.find(e => e.key == 'page'), 'value', 1);
    const [isOnEdit, setIsOnEdit] = React.useState(false);
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
        setIsOnEdit(false);
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
        { className: 'products-pagination uk-flex uk-flex-center' },
        React.createElement(
            'ul',
            { className: 'uk-pagination' },
            current > 1 && React.createElement(
                'li',
                { className: 'prev' },
                React.createElement(
                    'a',
                    { href: "#", onClick: e => onPrev(e) },
                    React.createElement(
                        'span',
                        null,
                        'Previous'
                    )
                )
            ),
            React.createElement(
                'li',
                { className: 'first' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onFirst(e) },
                    '1'
                )
            ),
            React.createElement(
                'li',
                { className: 'current' },
                isOnEdit === false && React.createElement(
                    'a',
                    { className: 'pagination-input-fake uk-input uk-form-small', href: '#', onClick: e => {
                            e.preventDefault();setIsOnEdit(true);
                        } },
                    current
                ),
                isOnEdit === true && React.createElement('input', { className: 'uk-input uk-form-small', value: inputVal, onChange: e => setInPutVal(e.target.value), type: 'text', onKeyPress: e => onKeyPress(e) })
            ),
            React.createElement(
                'li',
                { className: 'last' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onLast(e) },
                    Math.ceil(total / limit)
                )
            ),
            current * limit < total && React.createElement(
                'li',
                { className: 'next' },
                React.createElement(
                    'a',
                    { href: "#", onClick: e => onNext(e) },
                    React.createElement(
                        'span',
                        null,
                        'Next'
                    )
                )
            )
        ),
        React.createElement(
            'span',
            null,
            total,
            ' records'
        )
    );
}