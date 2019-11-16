import ProductList from '../../product/list/list.js';
import {ROOT_PRODUCT_COLLECTION_FILTER_DEFINED} from "../../../../../../../../js/production/event-types.js";
import {ReducerRegistry} from "../../../../../../../../js/production/reducer_registry.js";

function usePrevious(value) {
    const ref = React.useRef();

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}


function reducer(rootProductCollectionFilter = [], action = {}) {
    if(
        action.type === ROOT_PRODUCT_COLLECTION_FILTER_DEFINED
    ) {
        if(action.payload.rootProductCollectionFilter !== undefined)
            return action.payload.rootProductCollectionFilter;

    }
    return rootProductCollectionFilter;
}

ReducerRegistry.register('rootProductCollectionFilter', reducer);


export default function Products({ps = [], categoryId, addItemApi}) {
    const dispatch = ReactRedux.useDispatch();
    const apiUrl = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const [products, setProducts] = React.useState(() => {
        dispatch({'type' : ROOT_PRODUCT_COLLECTION_FILTER_DEFINED, 'payload': {'rootProductCollectionFilter': [{key: "category", operator: "IN", value: [categoryId]}]}});
        return ps;
    });

    const productCollectionFilter = ReactRedux.useSelector(state => state.productCollectionFilter);
    const prevProductCollectionFilter = usePrevious(productCollectionFilter);

    React.useEffect(() => {
        if(prevProductCollectionFilter === undefined || (productCollectionFilter.length === 0 && prevProductCollectionFilter.length === 0))
            return;
        applyFilter(productCollectionFilter);
    }, [productCollectionFilter]);

    const applyFilter = (filters) => {
        let formData = new FormData();
        formData.append('query', buildQuery(filters));
        axios({
            method: 'post',
            url: apiUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if(response.headers['content-type'] !== "application/json")
                throw new Error('Something wrong, please try again');
            if(_.get(response, 'data.payload.data.productCollection.products')) {
                setProducts(_.get(response, 'data.payload.data.productCollection.products'));
            }
        }).catch(function (error) {
        }).finally(function() {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const buildQuery = (filters) => {
        let filterStr = `category : {operator: IN value: "${categoryId}"} `;
        filters.forEach((f,i) => {
            let value = f.value;
            if(f.operator == "IN")
                value = value.join(", ");
            filterStr +=`${f.key} : {operator : ${f.operator} value: "${value}"} `;
        });
        filterStr = filterStr.trim();
        if(filterStr)
            filterStr = `(filter : {${filterStr}})`;

        // TODO: field need to be changeable without overwriting this file
        return `{productCollection ${filterStr} {products {product_id name price url image { list }} total currentFilter}}`
    };
    return <ProductList products={products} addItemApi={addItemApi}/>
}