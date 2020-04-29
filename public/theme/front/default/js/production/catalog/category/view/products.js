import ProductList from '../../product/list/list.js';
import Pagination from "../../product/list/pagination.js";
import Sorting from "../../product/list/sorting.js";

export default function Products(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        props.with_sorting === true && React.createElement(Sorting, { sorting_options: props.sorting_options }),
        React.createElement(ProductList, { products: props.products }),
        props.with_pagination === true && React.createElement(Pagination, { total: props.total })
    );
}