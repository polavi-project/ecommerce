import { Fetch } from "./fetch.js";
import Area from "./area.js";
import LoadingBar from "./loading_bar.js";
import { store } from "./redux_store.js";
import { Head } from "./head.js";
import { REQUEST_END, INITIAL_PAGE_READY } from "./event-types.js";

console.log(store);
store.subscribe(() => {
    console.log(store.getState());
});

const App = () => {
    const dispatch = ReactRedux.useDispatch();
    React.useEffect(() => {
        let promises = [];
        let widgets = [];
        if (window.pageData.widgets !== undefined) {
            let temps = window.pageData.widgets;
            temps.forEach((widget, index) => {
                promises.push(import(widget.template).then(component => {
                    widgets.push({
                        id: widget.id,
                        org_id: widget.org_id,
                        component: component.default,
                        props: widget.props,
                        area: widget.area,
                        sort_order: widget.sort_order
                    });
                }));
            });
        }

        Promise.all(promises).then(() => {
            // Remove global scripts
            delete window.pageData.appState.helmet.scripts;
            // Override widgets
            window.pageData.widgets = widgets;
            dispatch({ 'type': INITIAL_PAGE_READY, 'payload': { data: window.pageData } });
            dispatch({ 'type': REQUEST_END, 'payload': { data: window.pageData } });
        }).catch(e => {
            console.log(e);
            console.log(e.message);
            console.log(e.fileName);
            console.log(e.lineNumber);
        }).finally(function () {});
    }, []);

    return React.createElement(Area, {
        id: "wrapper",
        className: "wrapper",
        coreWidgets: [{
            'component': Head,
            'props': {},
            'sort_order': 0,
            'id': 'head'
        }, {
            'component': LoadingBar,
            'props': {},
            'sort_order': 1,
            'id': 'loading_bar'
        }]
    });
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