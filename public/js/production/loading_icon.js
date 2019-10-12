import { REQUEST_START, REQUEST_END } from "./event-types.js";

const LoadingIcon = function () {
    const [active, setActive] = React.useState(false);

    PubSub.subscribe(REQUEST_START, function (message, data) {
        setActive(true);
    });
    PubSub.subscribe(REQUEST_END, function (message, data) {
        setActive(false);
    });
    return React.createElement(
        "div",
        { className: "spinner", style: { display: active ? 'block' : 'none' } },
        React.createElement("div", { className: "rect1" }),
        React.createElement("div", { className: "rect2" }),
        React.createElement("div", { className: "rect3" }),
        React.createElement("div", { className: "rect4" }),
        React.createElement("div", { className: "rect5" })
    );
};

export default LoadingIcon;