import {Fetch} from "../../../../../../../js/production/fetch.js";

export default function AddToCart({addItemApi, areaProps}) {
    const onAddToCart = (e) => {
        e.preventDefault();
        Fetch(addItemApi, false, "POST", {product_id: areaProps.product.product_id, qty: 1});
    };

    return <div className="add-to-cart">
        <a className="uk-button uk-button-primary uk-button-small"
           onClick={(e)=>onAddToCart(e)}>
            <span>Add to cart</span>
        </a>
    </div>
}