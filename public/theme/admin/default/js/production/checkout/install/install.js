var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../js/production/fetch.js";
import { ADD_APP_STATE } from "../../../../../../../js/dev/event-types.js";

function InstallCheckoutModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/checkout/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    React.useEffect(() => {
        if (letsGo === true && modules.catalog === true) {
            Fetch(api, false, 'POST', {}, null, response => {
                if (parseInt(response.success) === 1) dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { checkout: true }) } } });else dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { checkout: _.get(response, 'message', 'Something wrong') }) } } });
            });
        }
    }, [letsGo]);
    if (letsGo !== true) return null;

    return React.createElement(
        "li",
        { className: "uk-grid uk-width-expand" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Checkout module "
            )
        ),
        modules.checkout === true && React.createElement(
            "div",
            null,
            React.createElement("span", { className: "text-success", "uk-icon": "icon: check; ratio: 0.8" })
        ),
        modules.checkout === undefined && React.createElement(
            "div",
            { className: "spinner", style: { width: '30px', height: '20px' } },
            React.createElement("div", { className: "rect1" }),
            React.createElement("div", { className: "rect2" }),
            React.createElement("div", { className: "rect3" }),
            React.createElement("div", { className: "rect4" }),
            React.createElement("div", { className: "rect5" })
        ),
        modules.checkout !== true && modules.checkout !== undefined && React.createElement(
            "div",
            { className: "text-danger" },
            modules.checkout
        )
    );
}

export { InstallCheckoutModule };