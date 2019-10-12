var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { UPDATE_WIDGETS } from "./event-types.js";
import { ReducerRegistry } from "./reducer_registry.js";

function Area(props) {
    let Wrapper$Component = props.reactcomponent === undefined ? "div" : props.reactcomponent;
    const getWidgets = widgets => {
        let coreWidgets = props.coreWidgets ? props.coreWidgets : [];
        let term = widgets !== undefined ? coreWidgets.concat(widgets.filter(e => {
            return e.area === props.id;
        })) : coreWidgets;

        let items = term.sort(function (obj1, obj2) {
            return obj1.sort_order - obj2.sort_order;
        });

        return items.map(c => {
            let C = c.component;
            return React.createElement(C, _extends({ key: c.id }, c.props, { areaProps: props }));
        });
    };

    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets));
    let args = [Wrapper$Component, { className: props.className ? props.className : "" }];
    widgets.forEach(w => {
        args.push(w);
    });
    if (widgets.length === 0) return null;else return React.createElement.apply(null, args);
}

function reducer(state = [], action = {}) {
    if (action.type === UPDATE_WIDGETS) {
        if (action.payload.widgets !== undefined) {
            if (action.payload.isNewPage === true) {
                return action.payload.widgets;
            } else {
                let widgets = state;
                action.payload.widgets.forEach(w => {
                    widgets = widgets.filter(widget => widget.org_id !== w.org_id);
                    widgets.push(w);
                });
                return widgets;
            }
        }
    }
    return state;
}

ReducerRegistry.register('widgets', reducer);

export default Area;