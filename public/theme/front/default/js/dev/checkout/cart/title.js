import {Fetch} from "../../../../../../../js/production/fetch_new";

function Title() {
    return <div>
        <h1 className="uk-text-center">Shopping cart</h1>
        <a href="#" onClick={((e) => {e.preventDefault(); Fetch(
            'http://localhost/myapp/public/cart',
            false,
            'get'
        )})}>Check Fetch</a>
    </div>
}

export default Title