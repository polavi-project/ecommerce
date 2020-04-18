import A from "../../../../../../../../js/production/a.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";

export default function ActionColumnRow({ areaProps, deleteUrl }) {
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
                location.reload();
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
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                A,
                { url: _.get(areaProps, 'row.editUrl', '') },
                React.createElement("i", { className: "fas fa-edit" })
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: e => {
                        e.preventDefault();deleteProduct(areaProps.row.product_id);
                    }, className: "text-danger" },
                React.createElement("i", { className: "fas fa-trash-alt" })
            )
        )
    );
}