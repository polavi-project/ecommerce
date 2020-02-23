import {ReducerRegistry} from "./reducer_registry.js";

// Redux state
const initialState = {};

const combineReducer = (reducers) => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(item => {
        if (reducerNames.indexOf(item) === -1) {
            reducers[item] = (state = null) => state;
        }
    });
    return Redux.combineReducers(reducers);
};

const reducer = combineReducer(ReducerRegistry.getReducers());

const store = Redux.createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
ReducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combineReducer(reducers));
});

export {store}
