export default function Pagination({total, currentFilters, setFilter}) {
    const limit = _.get(currentFilters.find((e)=> e.key == 'limit'), 'value', 20);
    const current = _.get(currentFilters.find((e)=> e.key == 'page'), 'value', 1);
    const [inputVal, setInPutVal] = React.useState(current);

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);

    const onKeyPress = (e) => {
        if(e.which !== 13)
            return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if(page < 1)
            page = 1;
        if(page > Math.ceil(total/limit))
            page = Math.ceil(total/limit);
        setFilter('page', '=', page);
    };

    const onPrev = (e) => {
        e.preventDefault();
        let prev = current - 1;
        if(current === 1)
            return;
        setFilter('page', '=', prev);
    };

    const onNext = (e) => {
        e.preventDefault();
        let next = current + 1;
        if(current * limit >= total)
            return;
        setFilter('page', '=', next);
    };

    const onFirst = (e) => {
        e.preventDefault();
        if(current === 1)
            return;
        setFilter('page', '=', 1);
    };

    const onLast = (e) => {
        e.preventDefault();
        if(current === Math.ceil(total/limit))
            return;
        setFilter('page', '=', Math.ceil(total/limit));
    };

    return <div className="grid-pagination-container">
        <table className="grid-pagination mb-4">
            <tr>
                {current > 1 && <td className="prev"><a href={"#"} onClick={(e) => onPrev(e)}><i className="far fa-caret-square-left"></i></a></td>}
                <td className="first"><a href="#" onClick={(e) => onFirst(e)}>1</a></td>
                <td className="current">
                    <input className="form-control" value={inputVal} onChange={(e) => setInPutVal(e.target.value)} type="text" onKeyPress={(e)=> onKeyPress(e)} />
                </td>
                <td className="last"><a href="#" onClick={(e) => onLast(e)}>{Math.ceil(total/limit)}</a></td>
                {(current * limit) < total && <td className="next"><a href={"#"} onClick={(e) => onNext(e)}><i className="far fa-caret-square-right"></i></a></td>}
                <td className="total"><span>{total} records</span></td>
            </tr>
        </table>
    </div>
}