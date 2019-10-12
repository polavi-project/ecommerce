import {Fetch} from "../../../../../../../js/production/fetch.js";

export default function CheckoutButton({action, cartId}) {

    const onClick = (e) => {
        e.preventDefault();
        Fetch(action, false, 'POST', {cartId: cartId});
    };

    return <div className="checkout-button">
        <a href="#" onClick={(e)=>onClick(e)} className="uk-button uk-button-small"><span>Place order</span></a>
    </div>
}