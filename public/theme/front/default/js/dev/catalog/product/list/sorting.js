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

    return <div className="product-sorting uk-clearfix uk-flex-right uk-flex">
        <div className="product-sorting-inner uk-flex-right uk-flex">
            <div><span className="label">Sort By</span></div>
            <select
                className="uk-select uk-form-small"
                onChange={(e)=>onChangeSort(e)}
                ref={sortByRef}
            >
                <option value="" disabled={true}>Sort product</option>
                {sortingOptions.map((s, i) => {
                    return <option value={s.code} key={i}>{s.name}</option>
                })}
            </select>
            <div className="sort-direction">
                <a onClick={(e)=>onChangeDirection(e)}><span uk-icon={
                    currentSortOrder === "DESC" ? "icon: arrow-up; ratio: 1" : "icon: arrow-down; ratio: 1"
                }></span></a>
            </div>
        </div>
    </div>
}