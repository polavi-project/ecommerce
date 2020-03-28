import ProductList from '../../product/list/list.js';
import { Fetch } from "../../../../../../../../js/production/fetch.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";
import { PRODUCT_COLLECTION_FILTER_CHANGED } from "../../../../../../../../js/production/event-types.js";
import { ReducerRegistry } from "../../../../../../../../js/production/reducer_registry.js";
import Pagination from "../../product/list/pagination.js";
import Sorting from "../../product/list/sorting.js";

function usePrevious(value) {
    const ref = React.useRef();

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function reducer(productCollectionFilter = [], action = {}) {
    if (action.type === PRODUCT_COLLECTION_FILTER_CHANGED) {
        if (action.payload.productCollectionFilter !== undefined) return action.payload.productCollectionFilter;
    }
    return productCollectionFilter;
}

ReducerRegistry.register('productCollectionFilter', reducer);

export default function Products(props) {
    const dispatch = ReactRedux.useDispatch();
    const apiUrl = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const [products, setProducts] = React.useState(props.products);
    const [total, setTotal] = React.useState(props.total);

    const productCollectionFilter = ReactRedux.useSelector(state => state.productCollectionFilter);

    React.useEffect(() => {
        if (productCollectionFilter.length !== 0) applyFilter(productCollectionFilter);
    }, [productCollectionFilter]);

    const applyFilter = filters => {
        let formData = new FormData();
        formData.append('query', buildQuery(filters));
        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.productCollection.products')) {
                setProducts(_.get(response, 'payload.data.productCollection.products'));
                setTotal(parseInt(_.get(response, 'payload.data.productCollection.total')));
            } else {
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "filter_update_error", message: 'Something wrong, please try again', type: "error" }] } });
            }
        });
    };

    const buildQuery = filters => {
        let filterStr = ``;

        for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
                let value = filters[key].value;
                if (filters[key].operator == "IN" && Array.isArray(value)) value = value.join(", ");
                filterStr += `${key} : {operator : "${filters[key].operator}" value: "${value}"} `;
            }
        }
        filterStr = filterStr.trim();
        if (filterStr) filterStr = `(filter : {${filterStr}})`;

        return props.query.replace("<FILTER>", filterStr);
    };

    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        props.with_sorting === true && React.createElement(Sorting, { sorting_options: props.sorting_options }),
        React.createElement(ProductList, { products: products }),
        props.with_pagination === true && React.createElement(Pagination, { total: total })
    );
}