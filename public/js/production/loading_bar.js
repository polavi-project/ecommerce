import { REQUEST_START, REQUEST_END } from "./event-types.js";
import { ReducerRegistry } from "./reducer_registry.js";

const LoadingBar = function () {
    const fetching = ReactRedux.useSelector(state => state.fetching);
    const [width, setWidth] = React.useState(0);
    const widthRef = React.useRef(0);
    React.useEffect(() => {
        widthRef.current = width;
        if (fetching === true) {
            let step = _.random(1, 3, true);
            let peak = _.random(85, 95, true);
            if (widthRef.current < peak) {
                const timer = setTimeout(() => setWidth(widthRef.current + step), 0);
                return () => clearTimeout(timer);
            }
        } else {
            if (widthRef.current === 100) {
                setWidth(0);
                widthRef.current = 0;
            } else if (widthRef.current !== 0) setWidth(100);
        }
    });

    return React.createElement("div", { className: "loading-bar", style: { width: width + '%', display: fetching === true ? "block" : "none" } });
};

function reducer(state = false, action = {}) {
    if (action.type === REQUEST_START) {
        state = true;
    }
    if (action.type === REQUEST_END) {
        state = false;
    }

    return state;
}

ReducerRegistry.register('fetching', reducer);

export default LoadingBar;