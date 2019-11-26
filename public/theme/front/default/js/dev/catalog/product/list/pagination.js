import {PRODUCT_COLLECTION_FILTER_CHANGED} from "../../../../../../../../js/production/event-types.js";

export default function Pagination({total}) {
    const dispatch = ReactRedux.useDispatch();
    const filters = ReactRedux.useSelector(state => {
        if(_.get(state, 'productCollectionFilter').length > 0)
            return _.get(state, 'productCollectionFilter');
        else
            return _.get(state, 'appState.productCollectionRootFilter')
    });
    const limit = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionRootFilter.limit.value', 20));
    const current = ReactRedux.useSelector(state => _.get(state, 'productCollectionFilter.page.value', 1));
    const [isOnEdit, setIsOnEdit] = React.useState(false);
    const [inputVal, setInPutVal] = React.useState(current);

    React.useEffect(() => {
        setInPutVal(current);
    }, [current]);
    const onKeyPress = (e) => {
        if(e.which !== 13)
            return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if(page < 1) page = 1;
        if(page > Math.ceil(total/limit)) page = Math.ceil(total/limit);
        dispatch({'type' : PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': {'productCollectionFilter': {...filters, page: {operator: "=", value: page}}}});
        setIsOnEdit(false);
    };

    const onPrev = (e) => {
        e.preventDefault();
        let prev = current - 1;
        if(current === 1)
            return;
        dispatch({'type' : PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': {'productCollectionFilter': {...filters, page: {operator: "=", value: prev}}}});
    };

    const onNext = (e) => {
        e.preventDefault();
        let next = current + 1;
        if(current * limit >= total)
            return;
        dispatch({'type' : PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': {'productCollectionFilter': {...filters, page: {operator: "=", value: next}}}});
    };

    const onFirst = (e) => {
        e.preventDefault();
        if(current === 1)
            return;
        dispatch({'type' : PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': {'productCollectionFilter': {...filters, page: {operator: "=", value: 1}}}});
    };

    const onLast = (e) => {
        e.preventDefault();
        if(current === Math.ceil(total/limit))
            return;
        dispatch({'type' : PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': {'productCollectionFilter': {...filters, page: {operator: "=", value: Math.ceil(total/limit)}}}});
    };

    return <div className="products-pagination uk-flex-center">
        <ul className="uk-pagination">
            {current > 1 && <li className="prev"><a href={"#"} onClick={(e) => onPrev(e)}><span>Previous</span></a></li>}
            <li className="first"><a href="#" onClick={(e) => onFirst(e)}>1</a></li>
            <li className="current">
                {isOnEdit === false && <a className="pagination-input-fake uk-input uk-form-small" href="#" onClick={(e) => {e.preventDefault(); setIsOnEdit(true)}}>{current}</a>}
                {isOnEdit === true && <input className="uk-input uk-form-small" value={inputVal} onChange={(e) => setInPutVal(e.target.value)} type="text" onKeyPress={(e)=> onKeyPress(e)} />}
            </li>
            <li className="last"><a href="#" onClick={(e) => onLast(e)}>{Math.ceil(total/limit)}</a></li>
            {(current * limit) < total && <li className="next"><a href={"#"} onClick={(e) => onNext(e)}><span>Next</span></a></li>}
        </ul>
    </div>
}