import {UPDATE_WIDGETS, REQUEST_END} from "./event-types.js";
import {ReducerRegistry} from "./reducer_registry.js";

function Area(props) {
    let Wrapper$Component = props.reactcomponent === undefined ? "div" : props.reactcomponent;
    const getWidgets = (widgets) => {
        let coreWidgets = props.coreWidgets ? props.coreWidgets : [];
        let term = widgets !== undefined ? coreWidgets.concat(widgets.filter((e)=> {
            return e.area === props.id;
        })) : coreWidgets;

        let items = term.sort(function(obj1, obj2) {
            return obj1.sort_order - obj2.sort_order;
        });

        return items.map((c) => {
            let C = c.component;
            if(typeof C === 'string')
                return <C key={c.id} {...c.props} />;
            else
                return <C key={c.id} {...c.props} areaProps={props}/>;
        });
    };

    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets), _.isEqual);
    let wrapperProps = {};
    if(typeof props.wrapperProps === 'object' && props.wrapperProps !== null)
        wrapperProps = {className : props.className ? props.className : "" , ...props.wrapperProps};
    else
        wrapperProps = {className : props.className ? props.className : "" };

    let args = [
        Wrapper$Component,
        wrapperProps
    ];
    widgets.forEach((w) => {
        args.push(w);
    });

    React.useEffect(()=>{
        console.log("Area is rerendering", props.id);
    });

    if(widgets.length === 0)
        return null;
    else
        return React.createElement.apply(null, args);
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