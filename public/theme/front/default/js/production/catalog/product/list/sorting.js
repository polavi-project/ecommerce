export default function Sorting({ options }) {
    const dispatch = ReactRedux.useDispatch();
    const filters = ReactRedux.useSelector(state => {
        if (_.get(state, 'productCollectionFilter').length > 0) return _.get(state, 'productCollectionFilter');else return _.get(state, 'appState.productCollectionRootFilter');
    });

    return React.createElement('div', { className: "abc" });
}