var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

export default class Reducer {
    constructor() {
        this.reducers = {
            loading: (state = false, action) => {
                if (action.type === "START_REQUEST") {
                    return true;
                }
                if (action.type === "FINISH_REQUEST") {
                    return false;
                }
                return state;
            },
            widgets: (state = [], action) => {
                if (action.type === "FINISH_REQUEST") {
                    if (action.widgets !== undefined) {
                        if (parseInt(action.is_new_page) === 1) {
                            return action.widgets;
                        } else {
                            let widgets = state;
                            action.widgets.forEach(w => {
                                widgets = widgets.filter(widget => widget.org_id !== w.org_id);
                                widgets.push(w);
                            });
                            return widgets;
                        }
                    }
                }
                return state;
            },
            form_validation_errors: (state = {}, action) => {
                if (action.type === "FORM_VALIDATE") {
                    return _extends({}, action.errors);
                }
                if (action.type === "REMOVE_VALIDATION_RULE") {
                    let errors = state;
                    delete errors[action.field_name];
                    return errors;
                }
                return state;
            },
            form_fields: (state = [], action) => {
                switch (action.type) {
                    case 'ADD_FIELD':
                    case 'REMOVE_FIELD':
                        // TODO: logic to remove field
                        return [...state, { // TODO: check if field is already existed
                            name: action.name,
                            type: action.type,
                            validation_rules: action.rules
                        }];
                    default:
                        return state;
                }
            },
            form_validation_rules: (state = [], action) => {
                switch (action.type) {
                    case 'ADD_VALIDATION_RULE':
                        return [...state, { // TODO: check if rule is already existed
                            field_name: action.field_name,
                            callback: action.callback,
                            message: action.message
                        }];
                    case 'REMOVE_VALIDATION_RULE':
                        return state.filter(rule => {
                            return rule.field_name !== action.field_name;
                        });
                    default:
                        return state;
                }
            },
            alerts: (state = [], action) => {
                if (action.type === "FINISH_REQUEST") {
                    if (action.alerts !== undefined) return action.alerts;
                }
                return state;
            },
            minicart: (state = {}, action) => {
                if (action.type === "FINISH_REQUEST") {
                    if (action.minicart !== undefined) return action.minicart;
                }
                return state;
            }
        };
    }

    initReducer() {}

    addReducer() {}

    removeReducer() {}

    all() {
        return this.reducers;
    }
}