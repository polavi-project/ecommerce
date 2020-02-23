var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { UPDATE_WIDGETS, REQUEST_END } from "./event-types.js";
import { ReducerRegistry } from "./reducer_registry.js";

function Area(props) {
    const getWidgets = widgets => {
        let coreWidgets = props.coreWidgets ? props.coreWidgets : [];
        let term = widgets !== undefined ? coreWidgets.concat(widgets.filter(e => {
            return e.area === props.id;
        })) : coreWidgets;

        return term.sort(function (obj1, obj2) {
            return obj1.sort_order - obj2.sort_order;
        });
    };

    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets), _.isEqual);

    let Wrapper$Component = props.noOuter !== true ? "div" : React.Fragment;

    if (widgets.length === 0) return null;

    return React.createElement(
        Wrapper$Component,
        _extends({}, props, { areaProps: undefined, coreWidgets: undefined }),
        widgets.map(w => {
            let C = w.component;
            if (typeof C === 'string') return React.createElement(C, _extends({ key: c.id }, c.props));
            return React.createElement(C, _extends({ key: w.id }, w.props, { areaProps: props }));
        })
    );
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
    } else if (action.type === REQUEST_END) {
        if (_.get(action.payload, 'data.widgets') !== undefined) {
            if (_.get(action.payload, 'data.isNewPage') === true) {
                return _.get(action.payload, 'data.widgets');
            } else {
                let widgets = state;
                action.payload.data.widgets.forEach(w => {
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