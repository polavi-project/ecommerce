import {UPDATE_WIDGETS, REQUEST_END} from "./event-types.js";
import {ReducerRegistry} from "./reducer_registry.js";

function Area(props) {
    const getWidgets = (widgets) => {
        let coreWidgets = props.coreWidgets ? props.coreWidgets : [];
        let term = widgets !== undefined ? coreWidgets.concat(widgets.filter((e)=> {
            return e.area === props.id;
        })) : coreWidgets;

        return term.sort(function(obj1, obj2) {
            return obj1.sort_order - obj2.sort_order;
        });
    };

    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets), _.isEqual);
    const templateDebugMode = ReactRedux.useSelector(state => _.get(state, 'appState.template_debug_mode', 0));

    let Wrapper$Component = props.noOuter !== true ? (props.wrapper !== undefined ? props.wrapper : "div") : React.Fragment;

    let wrapperProps = {};
    if(typeof props.wrapperProps === 'object' && props.wrapperProps !== null)
        wrapperProps = {className : props.className ? props.className : "" , ...props.wrapperProps};
    else
        wrapperProps = {className : props.className ? props.className : "" };

    if(widgets.length === 0 && parseInt(templateDebugMode) === 0)
        return null;

    if(parseInt(templateDebugMode) === 1)
        wrapperProps["className"] = wrapperProps.className += " debug-mode";

    return <Wrapper$Component {...wrapperProps}>
        {parseInt(templateDebugMode) === 1 && <span className={"area-id-debug"}>{props.id}</span>}
        {widgets.map((w) => {
            let C = w.component;
            if(typeof C === 'string')
                return <C key={w.id} {...w.props} />;
            return <C key={w.id} {...w.props} areaProps={props}/>;
        })}
    </Wrapper$Component>;
}

function reducer(state = [], action = {}) {
    if(action.type === UPDATE_WIDGETS) {
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

export default Area