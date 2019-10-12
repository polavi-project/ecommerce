import {REQUEST_START, REQUEST_END} from "./event-types.js"

const LoadingIcon = function() {
    const [active, setActive] = React.useState(false);

    PubSub.subscribe(REQUEST_START, function(message, data) {
        setActive(true);
    });
    PubSub.subscribe(REQUEST_END, function(message, data) {
        setActive(false);
    });
    return (<div className="spinner" style={{display: active ? 'block' : 'none'}}>
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
    </div>);
};

export default LoadingIcon