import {ADD_ALERT, REQUEST_END, ADD_APP_STATE} from "./event-types.js"

let _emitChange = null;
let reducers = {
    alerts: (state = [], action) => {
        if (action.type === ADD_ALERT) {
            if (action.payload.alerts !== undefined) return action.payload.alerts;
        }
        return state;
    },
    appState: (state = [], action = {}) => {
        if(action.type === ADD_APP_STATE) {
            if (action.payload.appState !== undefined) {
                return _.merge(state, action.payload.appState);
            }
        }
        return state;
    }
};
let ReducerRegistry = {};

ReducerRegistry.getReducers = function() {
    return {...reducers};
};

ReducerRegistry.register = function(name, reducer) {
    reducers = { ...reducers, [name]: reducer };
    if (_emitChange) {
        _emitChange(this.getReducers());
    }
};

ReducerRegistry.setChangeListener = function(listener) {
    _emitChange = listener;
};

export {ReducerRegistry}