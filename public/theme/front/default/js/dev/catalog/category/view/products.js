import ProductList from '../../product/list/list.js';
import Pagination from "../../product/list/pagination.js";
import Sorting from "../../product/list/sorting.js";

export default function Products(props) {
    return <div className="">
        <div className="tool-bar-top d-flex justify-content-sm-between">
            {props.with_pagination === true && <Pagination total={props.total} limit={props.limit} currentPage={props.currentPage}/>}
            {props.with_sorting === true && <Sorting sortingOptions={props.sorting_options} currentSortBy={props.currentSortBy} currentSortOrder={props.currentSortOrder}/>}
        </div>
        <ProductList products={props.products} countPerRow={props.countPerRow}/>
        {props.with_pagination === true && <Pagination total={props.total} limit={props.limit} currentPage={props.currentPage}/>}
    </div>
}