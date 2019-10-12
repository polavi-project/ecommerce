import { Fetch } from "../../../../../../../js/production/fetch_new";

function Title() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            { className: "uk-text-center" },
            "Shopping cart"
        ),
        React.createElement(
            "a",
            { href: "#", onClick: e => {
                    e.preventDefault();Fetch('http://localhost/myapp/public/cart', false, 'get');
                } },
            "Check Fetch"
        )
    );
}

export default Title;