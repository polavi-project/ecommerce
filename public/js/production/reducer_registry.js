var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { ADD_ALERT, REQUEST_END, ADD_APP_STATE } from "./event-types.js";

let _emitChange = null;
let reducers = {
    alerts: (state = [], action) => {
        if (action.type === ADD_ALERT) {
            if (action.payload.alerts !== undefined) return action.payload.alerts;
        } else if (action.type === REQUEST_END) {
            if (_.get(action.payload, 'data.alerts') !== undefined) return _.get(action.payload, 'data.alerts');
        }
        return state;
    },
    appState: (state = [], action = {}) => {
        if (action.type === ADD_APP_STATE) {
            let newState = action.payload.appState;
            if (newState !== undefined) {
                return _extends({}, state, newState);
            }
        } else if (action.type === REQUEST_END) {
            if (_.get(action.payload, 'data.appState') !== undefined) {
                let newState = action.payload.data.appState;
                return _extends({}, state, newState);
            }
        }
        return state;
    }
};
let ReducerRegistry = {};

ReducerRegistry.getReducers = function () {
    return _extends({}, reducers);
};

ReducerRegistry.register = function (name, reducer) {
    reducers = _extends({}, reducers, { [name]: reducer });
    if (_emitChange) {
        _emitChange(this.getReducers());
    }
};

ReducerRegistry.setChangeListener = function (listener) {
    _emitChange = listener;
};

export { ReducerRegistry };