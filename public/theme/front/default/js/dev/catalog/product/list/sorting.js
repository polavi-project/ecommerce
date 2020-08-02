import {Fetch} from "../../../../../../../../js/production/fetch.js";
import {buildFilterToQuery} from "./buildFilterToQuery.js";

export default function Sorting({sortingOptions = [], currentSortOrder, currentSortBy}) {
    const filters = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.productCollectionFilter')
    });
    const sortByRef = React.useRef("");
    React.useEffect(()=>{
        sortByRef.current.value = currentSortBy;
    });
    const currentUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.currentUrl')});

    const onChangeSort = (e) => {
        e.preventDefault();
        if(currentSortOrder === "ASC") {
            Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "sort-by", operator: "=", value: sortByRef.current.value}]]), true, "GET");
        } else
            Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "sort-by", operator: "=", value: sortByRef.current.value}]]), true, "GET");
    };

    const onChangeDirection = (e) => {
        e.preventDefault();

        if(currentSortOrder === "ASC") {
            Fetch(buildFilterToQuery(currentUrl, [...filters, ...[{key: "sort-order", operator: "=", value: "DESC"}]]), true, "GET");
        } else {
            Fetch(buildFilterToQuery(currentUrl, [...filters, ...[ {key: "sort-order", operator: "=", value: "ASC"}]]), true, "GET");
        }
    };

    if(sortingOptions.length === 0)
        return (null);

    return <div className="product-sorting">
        <div className="product-sorting-inner flex-column justify-content-end">
            <div><span className="label">Sort By</span></div>
            <select
                className="form-control"
                onChange={(e)=>onChangeSort(e)}
                ref={sortByRef}
            >
                <option value="" disabled={true}>Sort product</option>
                {sortingOptions.map((s, i) => {
                    return <option value={s.code} key={i}>{s.name}</option>
                })}
            </select>
            <div className="sort-direction">
                <a onClick={(e)=>onChangeDirection(e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="feather feather-arrow-up">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                    </svg></a>
            </div>
        </div>
    </div>
}