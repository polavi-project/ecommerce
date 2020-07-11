import ProductList from '../../product/list/list.js';
import Pagination from "../../product/list/pagination.js";
import Sorting from "../../product/list/sorting.js";

export default function Products(props) {
    return <div className="uk-width-1-1">
        {props.with_sorting === true && <Sorting sortingOptions={props.sorting_options} currentSortBy={props.currentSortBy} currentSortOrder={props.currentSortOrder}/>}
        <ProductList products={props.products}/>
        {props.with_pagination === true && <Pagination total={props.total} limit={props.limit} currentPage={props.currentPage}/>}
    </div>
}