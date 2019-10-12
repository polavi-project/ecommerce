import A from "../../../../../../../../js/production/a.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";

export default function ActionColumn({ areaProps, deleteUrl }) {
    React.useEffect(() => {
        areaProps.addField('product_id');
        areaProps.addField('editUrl');
    }, []);
    const dispatch = ReactRedux.useDispatch();
    const deleteProduct = id => {
        let formData = new FormData();
        formData.append('productId', id);
        axios({
            method: 'post',
            url: deleteUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if (response.headers['content-type'] !== "application/json") throw new Error('Something wrong, please try again');
            if (parseInt(_.get(response, 'data.payload.data.deleteProduct.status')) === 1) {
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "product_delete_ok", message: "Product deleted", type: "success" }] } });
                areaProps.applyFilter();
            } else {
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "product_delete_error", message: _.get(response, 'data.payload.data.deleteProduct.message'), type: "error" }] } });
            }
        }).catch(function (error) {}).finally(function () {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    return React.createElement(
        "td",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Action"
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(A, { url: _.get(r, 'editUrl', ''), text: "Edit" }),
                React.createElement(
                    "a",
                    { href: "#", onClick: () => deleteProduct(r.product_id) },
                    "Delete"
                )
            );
        })
    );
}