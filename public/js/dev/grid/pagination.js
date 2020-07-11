export default function Pagination({total, limit, page, setFilter}) {
    const pageInput = React.useRef(null);
    const limitInput = React.useRef(null);

    React.useEffect(() => {
        pageInput.current.value = page;
        limitInput.current.value = limit;
    });

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
        let prev = page - 1;
        if(page === 1)
            return;
        setFilter('page', '=', prev);
    };

    const onNext = (e) => {
        e.preventDefault();
        let next = page + 1;
        if(page * limit >= total)
            return;
        setFilter('page', '=', next);
    };

    const onFirst = (e) => {
        e.preventDefault();
        if(page === 1)
            return;
        setFilter('page', '=', 1);
    };

    const onLast = (e) => {
        e.preventDefault();
        if(page === Math.ceil(total/limit))
            return;
        setFilter('page', '=', Math.ceil(total/limit));
    };

    const onChangeLimit = (e) => {
        e.preventDefault();
        let limit = parseInt(e.target.value);
        if(limit < 1)
            return;
        setLimit(limit);
    };

    const onKeyPressLimit = (e) => {
        if(e.which !== 13)
            return;
        e.preventDefault();
        let limit = parseInt(e.target.value);
        if(limit < 1)
            return;
        setFilter('limit', '=', limit);
    };

    return <div className="grid-pagination-container">
        <table className="grid-pagination">
            <tr>
                <td><span>Show</span></td>
                <td className="limit">
                    <div className="flex-column-reverse sml-flex">
                        <input className="form-control" ref={limitInput} type="text" onKeyPress={(e)=> onKeyPressLimit(e)} />
                    </div>
                </td>
                <td className="per-page"><span>per page</span></td>
                {page > 1 && <td className="prev"><a href={"#"} onClick={(e) => onPrev(e)}><i className="far fa-caret-square-left"></i></a></td>}
                <td className="first"><a href="#" onClick={(e) => onFirst(e)}>1</a></td>
                <td className="current">
                    <input className="form-control" ref={pageInput} type="text" onKeyPress={(e)=> onKeyPress(e)} />
                </td>
                <td className="last"><a href="#" onClick={(e) => onLast(e)}>{Math.ceil(total/limit)}</a></td>
                {(page * limit) < total && <td className="next"><a href={"#"} onClick={(e) => onNext(e)}><i className="far fa-caret-square-right"></i></a></td>}
                <td className="total"><span>{total} records</span></td>
            </tr>
        </table>
    </div>
}