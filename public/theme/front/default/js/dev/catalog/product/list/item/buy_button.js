import {Fetch} from "../../../../../../../../../js/production/fetch.js";

function AddToCart({id, addItemApi}) {
    const onAddToCart = (e, id) => {
        e.preventDefault();
        Fetch(addItemApi, false, "POST", {product_id: id, qty: 1});
    };

    return <div className="add-to-cart">
        <a className="uk-button uk-button-primary uk-button-small"
           onClick={(e)=>onAddToCart(e, id)}>
            <span>Add to cart</span>
        </a>
    </div>
}

export {AddToCart}