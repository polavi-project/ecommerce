import Fetch from "./fetch.js";
import Area from "./area.js";
import LoadingIcon from "./loading_icon.js";
import reducerRegistry from "./reducer_registry.js";
let { Router, Link, Route, BrowserRouter, withRouter } = ReactRouterDOM;

// Redux state
const initialState = {};
const combine = reducers => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(item => {
        if (reducerNames.indexOf(item) === -1) {
            reducers[item] = (state = null) => state;
        }
    });
    return Redux.combineReducers(reducers);
};
const reducer = combine(reducerRegistry.getReducers());

const store = Redux.createStore(reducer, {});
reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combine(reducers));
});
store.subscribe(() => {
    console.log(store.getState());
});

class App extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        Fetch(dispatch, window.location.href);
    }
    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            console.log("on route change");
            console.log(location);
            console.log(action);
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('App is updating');
        return true;
    }

    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/" },
                        "Home"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/about" },
                        "About"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/topics" },
                        "Topics"
                    )
                )
            ),
            React.createElement("hr", null),
            React.createElement(Route, { path: "/", component: Home })
        );
    }
}
function Home() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "Home"
        )
    );
}

function About() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "About"
        )
    );
}

function Topics({ match }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "Topics"
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                React.createElement(
                    Link,
                    { to: `${match.url}/rendering` },
                    "Rendering with React"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    Link,
                    { to: `${match.url}/components` },
                    "Components"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    Link,
                    { to: `${match.url}/props-v-state` },
                    "Props v. State"
                )
            )
        ),
        React.createElement(Route, { path: `${match.path}/:topicId`, component: Topic }),
        React.createElement(Route, {
            exact: true,
            path: match.path,
            render: () => React.createElement(
                "h3",
                null,
                "Please select a topic."
            )
        })
    );
}

function Topic({ match }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            match.params.topicId
        )
    );
}
const AppComponent = withRouter(ReactRedux.connect()(App));
const Provider = ReactRedux.createProvider();
ReactDOM.render(React.createElement(
    Provider,
    { store: store },
    React.createElement(
        BrowserRouter,
        null,
        React.createElement(AppComponent, null)
    )
), window.document.getElementById("app"));

window.onpopstate = function (event) {
    Fetch(store.dispatch, document.location, false);
};