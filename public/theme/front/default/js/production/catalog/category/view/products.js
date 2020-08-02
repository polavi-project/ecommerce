import ProductList from '../../product/list/list.js';
import Pagination from "../../product/list/pagination.js";
import Sorting from "../../product/list/sorting.js";

export default function Products(props) {
    return React.createElement(
        "div",
        { className: "" },
        props.with_sorting === true && React.createElement(Sorting, { sortingOptions: props.sorting_options, currentSortBy: props.currentSortBy, currentSortOrder: props.currentSortOrder }),
        React.createElement(ProductList, { products: props.products }),
        props.with_pagination === true && React.createElement(Pagination, { total: props.total, limit: props.limit, currentPage: props.currentPage })
    );
}