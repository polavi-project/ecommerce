export default function Pagination({total}) {
    const filters = ReactRedux.useSelector(state => {
        if(_.get(state, 'productCollectionFilter').length > 0)
            return _.get(state, 'productCollectionFilter');
        else
            return _.get(state, 'appState.productCollectionRootFilter')
    });
    const limit = ReactRedux.useSelector(state => _.get(state, 'appState.productRootFilter.limit.value', 20));
    const current = ReactRedux.useSelector(state => _.get(state, 'appState.productRootFilter.page.value', 1));
    return <div>
        <ul className="pagination">
            {current > 1 && <li className="prev"><a href={"#"}><span>Previous</span></a></li>}
            <li className="first"></li>
            <li className="current"></li>
            <li className="last"></li>
            {(current * limit) < total && <li className="next"><a href={"#"}><span>Next</span></a></li>}
        </ul>
    </div>
}