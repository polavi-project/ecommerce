import A from "../../../../../../../../js/production/a.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";

export default function ActionColumn({areaProps, deleteUrl}) {
    React.useEffect(() => {
        areaProps.addField('product_id');
        areaProps.addField('editUrl');
    }, []);
    const dispatch = ReactRedux.useDispatch();
    const deleteProduct = (id) => {
        let formData = new FormData();
        formData.append('productId', id);
        axios({
            method: 'post',
            url: deleteUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if(response.headers['content-type'] !== "application/json")
                throw new Error('Something wrong, please try again');
            if(parseInt(_.get(response, 'data.payload.data.deleteProduct.status')) === 1) {
                dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "product_delete_ok", message: "Product deleted", type: "success"}]}});
                areaProps.applyFilter();
            } else {
                dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "product_delete_error", message: _.get(response, 'data.payload.data.deleteProduct.message'), type: "error"}]}});
            }
        }).catch(function (error) {
        }).finally(function() {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    return <td className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}>
                <A url={_.get(r, 'editUrl' , '')} text={"Edit"}/>
                <a href={"#"} onClick={() => deleteProduct(r.product_id)}>Delete</a>
            </div>;
        })}
    </td>
}