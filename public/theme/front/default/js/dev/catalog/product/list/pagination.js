import {buildFilterToQuery} from "./buildFilterToQuery.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

export default function Pagination({total, limit, currentPage}) {
    const filters = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.productCollectionFilter');
    });
    const [isOnEdit, setIsOnEdit] = React.useState(false);
    const [inputVal, setInPutVal] = React.useState(currentPage);
    const currentUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.currentUrl')});

    React.useEffect(() => {
        setInPutVal(currentPage);
    }, [currentPage]);

    const onKeyPress = (e) => {
        if(e.which !== 13)
            return;
        e.preventDefault();
        let page = parseInt(e.target.value);
        if(page < 1) page = 1;
        if(page > Math.ceil(total/limit)) page = Math.ceil(total/limit);
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "page", operator: "=", value: page}]]), true, "GET");
        setIsOnEdit(false);
    };

    const onPrev = (e) => {
        e.preventDefault();
        let prev = currentPage - 1;
        if(currentPage === 1)
            return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "page", operator: "=", value: prev}]]), true, "GET");
    };

    const onNext = (e) => {
        e.preventDefault();
        let next = currentPage + 1;
        if(currentPage * limit >= total)
            return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "page", operator: "=", value: next}]]), true, "GET");
    };

    const onFirst = (e) => {
        e.preventDefault();
        if(currentPage === 1)
            return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "page", operator: "=", value: 1}]]), true, "GET");
    };

    const onLast = (e) => {
        e.preventDefault();
        if(currentPage === Math.ceil(total/limit))
            return;
        Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "page", operator: "=", value: Math.ceil(total/limit)}]]), true, "GET");
    };

    return <div className="products-pagination uk-flex uk-flex-center">
        <ul className="uk-pagination">
            {currentPage > 1 && <li className="prev"><a href={"#"} onClick={(e) => onPrev(e)}><span>Previous</span></a></li>}
            <li className="first"><a href="#" onClick={(e) => onFirst(e)}>1</a></li>
            <li className="current">
                {isOnEdit === false && <a className="pagination-input-fake uk-input uk-form-small" href="#" onClick={(e) => {e.preventDefault(); setIsOnEdit(true)}}>{currentPage}</a>}
                {isOnEdit === true && <input className="uk-input uk-form-small" value={inputVal} onChange={(e) => setInPutVal(e.target.value)} type="text" onKeyPress={(e)=> onKeyPress(e)} />}
            </li>
            <li className="last"><a href="#" onClick={(e) => onLast(e)}>{Math.ceil(total/limit)}</a></li>
            {(currentPage * limit) < total && <li className="next"><a href={"#"} onClick={(e) => onNext(e)}><span>Next</span></a></li>}
        </ul>
    </div>
}