import {Fetch} from "./fetch.js";
import Area from "./area.js";
import LoadingIcon from "./loading_icon.js";
import {store} from "./redux_store.js"
import {Head} from "./head.js";

console.log(store);
store.subscribe(()=> {
    console.log(store.getState());
});
const App = ()=> {
    React.useEffect(()=> {
        Fetch(window.location.href);
    }, []);

    return (
        <div className="wrapper">
            <Head/>
            <LoadingIcon/>
            <Area
                id="container" className="container"
            />
        </div>
    )
};
const Provider = ReactRedux.Provider;

ReactDOM.render(<Provider store={store}><App /></Provider>, window.document.getElementById("app"));

window.onpopstate = function(event) {
    Fetch(document.location, false);
};