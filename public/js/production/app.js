import { Fetch } from "./fetch.js";
import Area from "./area.js";
import LoadingIcon from "./loading_icon.js";
import { store } from "./redux_store.js";
import { Head } from "./head.js";

console.log(store);
store.subscribe(() => {
    console.log(store.getState());
});
const App = () => {
    React.useEffect(() => {
        Fetch(window.location.href);
    }, []);

    return React.createElement(
        "div",
        { className: "wrapper" },
        React.createElement(Head, null),
        React.createElement(LoadingIcon, null),
        React.createElement(Area, {
            id: "container", className: "container"
        })
    );
};
const Provider = ReactRedux.Provider;

ReactDOM.render(React.createElement(
    Provider,
    { store: store },
    React.createElement(App, null)
), window.document.getElementById("app"));

window.onpopstate = function (event) {
    Fetch(document.location, false);
};